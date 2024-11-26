from marshmallow import Schema, fields, validate


class TipSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(required=True, validate=validate.Length(min=1, max=1000))
    category = fields.String(required=True, validate=validate.Length(min=1, max=255))
    image_url = fields.String(required=True, validate=validate.URL(error="Invalid image URL"))
