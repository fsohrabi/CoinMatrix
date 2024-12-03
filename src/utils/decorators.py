from functools import wraps
from flask import jsonify
from src.models.users import User
from flask_jwt_extended import get_jwt_identity


def role_required(roles, error_message="Access denied"):
    """
    A generic decorator to restrict access based on user roles.

    Args:
    - roles (list): A list of roles that are allowed access.
    - error_message (str): Custom error message for unauthorized access.

    Returns:
    - Function: The wrapped function if the user has the required role(s), else a 403 response.
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            # Check if user exists and has one of the required roles
            if not user or not any(user.has_role(role) for role in roles):
                return jsonify({"message": error_message}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator
