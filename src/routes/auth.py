"""
This module defines the authentication-related routes for the Flask application,
including user registration, login, token refreshing, and token revocation.

It uses Marshmallow for request validation and Flask-JWT-Extended for JWT-based
authentication. The module also integrates helper functions for token management
and revocation.

Routes:
- /register: Register a new user.
- /login: Authenticate a user and provide access/refresh tokens.
- /refresh: Refresh an access token using a refresh token.
- /revoke_access: Revoke an access token.
- /revoke_refresh: Revoke a refresh token.
"""

from flask import request, jsonify, Blueprint, current_app, make_response
from marshmallow import ValidationError

from src.models.users import User
from src.routes.helpers import add_token_to_database, revoke_token, is_token_revoked
from src.schemas.user import UserCreateSchema
from jwt.exceptions import InvalidTokenError
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)

from src import db, jwt
from src.schemas.user_login_schema import UserLoginSchema
from src.utils.user_role_utils import assign_role_to_user

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_blueprint.route("/register", methods=["POST"])
def register():
    """
    Register a new user in the system.

    Request Body (JSON):
    - name (str): The user's name. Must be at least 3 characters long.
    - email (str): A valid email address.
    - password (str): A password that meets security requirements.

    Returns:
    - 201: Success message if the user is registered.
    - 400: Validation error messages if the input is invalid.
    - 500: Error message for unexpected exceptions.
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    schema = UserCreateSchema()
    try:
        user_data = schema.load(request.json)
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        assign_role_to_user(user, "user")
        return jsonify({"message": "User registered successfully"}), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and issue JWT access and refresh tokens.

    Request Body (JSON):
    - email (str): The user's email address.
    - password (str): The user's password.

    Returns:
    - 200: Access and refresh tokens if authentication is successful.
    - 400: Validation error messages if the input is invalid.
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    schema = UserLoginSchema()
    try:
        data = schema.load(request.json)
        user = schema.validate_credentials(data)
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        add_token_to_database(access_token)
        add_token_to_database(refresh_token)
        # Set HTTP-only cookies
        response = make_response(jsonify({"message": "Login successful"}), 200)
        response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="Lax")
        response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False, samesite="Lax")
        return response
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh an expired access token using a valid refresh token.

    Returns:
    - 200: A new access token.
    """
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    add_token_to_database(access_token)
    return jsonify({"access_token": access_token}), 200


@auth_blueprint.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    """
    Logs out the user by revoking their access token.
    """
    jti = get_jwt()["jti"]
    revoke_token(jti, get_jwt_identity())
    response = make_response(jsonify({"message": "Logged out"}), 200)
    unset_jwt_cookies(response)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response


@auth_blueprint.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """
    Get the currently logged-in user's information.
    """
    token = request.cookies.get("access_token")
    if not token:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Unauthorized"}), 401

        return jsonify({
            "id": user.id,
            "name": user.name,
            "admin": user.has_role("admin"),
            "email": user.email
        })
    except InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@auth_blueprint.route("/revoke_access", methods=["DELETE"])
@jwt_required()
def revoke_access_token():
    """
    Revoke the currently active access token.

    Returns:
    - 200: Success message confirming token revocation.
    """
    jti = get_jwt()["jti"]
    revoke_token(jti, get_jwt_identity())
    return jsonify({"message": "token revoked"}), 200


@auth_blueprint.route("/revoke_refresh", methods=["DELETE"])
@jwt_required(refresh=True)
def revoke_refresh_token():
    """
    Revoke the currently active refresh token.

    Returns:
    - 200: Success message confirming token revocation.
    """
    jti = get_jwt()["jti"]
    revoke_token(jti, get_jwt_identity())
    return jsonify({"message": "token revoked"}), 200


@jwt.user_lookup_loader
def user_loader_callback(jwt_header, jwt_payload):
    """
    Load a user instance based on the JWT identity claim.

    Args:
    - jwt_payload (dict): The decoded JWT payload.

    Returns:
    - User: The user instance corresponding to the identity claim.
    """
    identity = jwt_payload[current_app.config['JWT_IDENTITY_CLAIM']]
    return User.query.get(identity)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """
    Check if a token has been revoked.

    Args:
    - jwt_payload (dict): The decoded JWT payload.

    Returns:
    - bool: True if the token is revoked, False otherwise.
    """
    return is_token_revoked(jwt_payload)
