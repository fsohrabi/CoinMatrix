from marshmallow import validate, validates_schema, ValidationError, Schema, fields
from src.models.users import User


class UserSchema(Schema):
    """Base schema for user validation."""
    name = fields.String(
        required=True,
        validate=validate.Length(min=3),
        error_messages={"required": "Name is required", "invalid": "Invalid name format"},
    )
    email = fields.Email(required=True, error_messages={"required": "Email is required"})

    @validates_schema
    def validate_email(self, data, **kwargs):
        """Ensure the email is unique and attach the error to the 'email' field."""
        if User.query.filter_by(email=data.get("email")).count():
            raise ValidationError({"email": ["Your email  already exists."]})


class UserCreateSchema(UserSchema):
    """Schema for creating a new user, including password validation."""
    password = fields.String(
        required=True,
        validate=validate.Regexp(
            r"^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$",
            error=(
                "Password must be at least 8 characters long, including 1 uppercase, "
                "1 lowercase, 1 special character, and 1 number."
            ),
        ),
    )
