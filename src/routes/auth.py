from flask import request, jsonify, Blueprint
from marshmallow import ValidationError
from src.models.users import User
from src.schemas.user import UserCreateSchema
from src import db

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
