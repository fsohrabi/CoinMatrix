from marshmallow import Schema, fields, ValidationError
from src.models.users import User
from src import pwd_context


class UserLoginSchema(Schema):
    """
    Schema for validating user login credentials.
    """
    email = fields.Email(
        required=True,
        error_messages={"required": "Email is required", "invalid": "Invalid email format"}
    )
    password = fields.String(
        required=True,
        error_messages={"required": "Password is required"}
    )

    def validate_credentials(self, data):
        """
        Validates email and password against stored user data.

        :param data: Dictionary containing login credentials
        :return: The authenticated user instance
        :raises ValidationError: If email or password is invalid
        """
        user = User.query.filter_by(email=data.get("email")).first()
        if not user or not pwd_context.verify(data.get("password"), user.password):
            raise ValidationError("Invalid email or password.")
        return user
