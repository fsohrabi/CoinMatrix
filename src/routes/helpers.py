"""
This module contains helper functions for managing JWT tokens, including adding tokens
to the database, checking if a token is revoked, and revoking tokens.

Functions:
- add_token_to_database(encoded_token): Adds a JWT token to the database.
- is_token_revoked(jwt_payload): Checks whether a token has been revoked.
- revoke_token(token_jti, user): Marks a token as revoked in the database.
"""

from datetime import datetime

from flask import current_app
from flask_jwt_extended import decode_token
from sqlalchemy.orm.exc import NoResultFound

from src import db
from src.models.auth import TokenBlocklist


def add_token_to_database(encoded_token):
    """
    Add a JWT token to the database for tracking and revocation purposes.

    Args:
    - encoded_token (str): The encoded JWT token.

    Decodes the token, extracts necessary information (e.g., jti, token type, user ID,
    and expiration time), and stores it in the `TokenBlocklist` model.

    Raises:
    - Any exception from database operations will propagate.
    """
    decoded_token = decode_token(encoded_token)
    jti = decoded_token["jti"]
    token_type = decoded_token["type"]
    user_id = decoded_token[current_app.config['JWT_IDENTITY_CLAIM']]
    expires = datetime.fromtimestamp(decoded_token["exp"])

    db_token = TokenBlocklist(
        jti=jti,
        token_type=token_type,
        user_id=user_id,
        expires=expires,
    )
    db.session.add(db_token)
    db.session.commit()


def is_token_revoked(jwt_payload):
    """
    Check whether a token has been revoked.

    Args:
    - jwt_payload (dict): The decoded JWT payload.

    Returns:
    - bool: True if the token has been revoked or is not found, False otherwise.

    This function queries the `TokenBlocklist` model for the token's `jti` and checks
    if the `revoked_at` field is set.
    """
    jti = jwt_payload["jti"]
    try:
        token = TokenBlocklist.query.filter_by(jti=jti).one()
        return token.revoked_at is not None
    except NoResultFound:
        return True


def revoke_token(token_jti, user):
    """
    Mark a token as revoked by setting the `revoked_at` field to the current timestamp.

    Args:
    - token_jti (str): The unique identifier (jti) of the token to be revoked.
    - user (int): The ID of the user who owns the token.

    Raises:
    - Exception: If the token is not found in the database.

    This function ensures that only valid tokens associated with the user can be revoked.
    """
    try:
        token = TokenBlocklist.query.filter_by(jti=token_jti, user_id=user).one()
        token.revoked_at = datetime.utcnow()
        db.session.commit()
    except NoResultFound:
        raise Exception("Could not find the token {}".format(token_jti))
