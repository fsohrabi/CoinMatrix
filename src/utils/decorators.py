from functools import wraps
from flask import jsonify
from src.models.users import User
from flask_jwt_extended import get_jwt_identity


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.has_role("admin"):
            return jsonify({"message": "Admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper


def user_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.has_role("admin"):
            return jsonify({"message": "User access required"}), 403
        return fn(*args, **kwargs)

    return wrapper
