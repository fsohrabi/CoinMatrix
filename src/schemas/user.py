from marshmallow import validate, validates_schema, ValidationError, Schema, fields
from src.models.users import User


class UserSchema(Schema):
    name = fields.String(
        required=True,
        validate=[validate.Length(min=3)],
        error_messages={
            "required": "The name is required",
            "invalid": "The name is invalid and needs to be a string",
        },
    )
    email = fields.String(required=True, validate=[validate.Email()])

    @validates_schema
    def validate_email(self, data, **kwargs):
        email = data.get("email")
        if User.query.filter_by(email=email).count():
            raise ValidationError(f"Email {email} already exists.")


class UserCreateSchema(UserSchema):
    password = fields.String(
        required=True,
        validate=[
            validate.Regexp(
                r"^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                error=(
                    "The password needs to be at least 8 characters long and "
                    "have at least 1 of each of the following: lowercase letter, "
                    "uppercase letter, special character, number."
                ),
            )
        ],
    )
