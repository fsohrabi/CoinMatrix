from flask import request, jsonify, Blueprint
from marshmallow import ValidationError
from src.models.users import User
from src.routes.helpers import add_token_to_database
from src.schemas.user import UserCreateSchema
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from src import db, pwd_context
from src.schemas.user_login_schema import UserLoginSchema

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_blueprint.route("/register", methods=["POST"])
def register():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    schema = UserCreateSchema()
    try:
        user_data = schema.load(request.json)
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        # Catch any other unexpected errors
        return jsonify({"error": str(e)}), 500


@auth_blueprint.route("/login", methods=["POST"])
def login():
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
        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    add_token_to_database(access_token)
    return jsonify({"access_token": access_token}), 200
