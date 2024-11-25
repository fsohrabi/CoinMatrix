from marshmallow import Schema, fields, validate, ValidationError
from src.models.users import User
from src import pwd_context


class UserLoginSchema(Schema):
    email = fields.String(
        required=True,
        validate=[validate.Email()],
        error_messages={"required": "Email is required", "invalid": "Invalid email format"}
    )
    password = fields.String(
        required=True,
        error_messages={"required": "Password is required"}
    )

    def validate_credentials(self, data):
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not pwd_context.verify(password, user.password):
            raise ValidationError("Invalid email or password.")

        return user
