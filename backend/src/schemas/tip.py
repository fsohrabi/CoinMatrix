from marshmallow import Schema, fields, validate, pre_load
import bleach  # For HTML sanitization


class TipSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(required=True, validate=validate.Length(min=1))

    category = fields.String(required=False, validate=validate.Length(min=1, max=255))

    image = fields.String(
        required=True,
        validate=validate.URL(error="Invalid image URL")
    )

    is_active = fields.Boolean()

    @pre_load
    def sanitize_description(self, data, **kwargs):
        """Sanitize the description to remove unwanted HTML tags."""
        if "description" in data:
            allowed_tags = ["p", "br", "b", "i", "u", "strong", "em", "ul", "ol", "li", "a"]
            data["description"] = bleach.clean(data["description"], tags=allowed_tags, strip=True)
        return data
