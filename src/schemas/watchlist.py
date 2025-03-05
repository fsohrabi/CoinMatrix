from marshmallow import Schema, fields


class WatchlistSchema(Schema):
    """Schema for validating user watchlist input data."""

    coin_id = fields.Int(required=True, error_messages={"required": "coin_id is required"})
    user_id = fields.Int(required=True, error_messages={"required": "user_id is required"})
