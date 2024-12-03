# src/utils/helpers.py

"""
Utility functions for JWT management and data transformation.
"""

from datetime import datetime
import os
import requests

from flask import current_app
from flask_jwt_extended import decode_token
from sqlalchemy.orm.exc import NoResultFound

from src import db
from src.models.auth import TokenBlocklist
from src.utils.errors import TokenNotFoundError


# ========================== API UTILITIES ==========================

def fetch_coinmarketcap_data(endpoint, parameters=None):
    """
    Fetch data from the CoinMarketCap API and handle potential errors.

    Args:
        endpoint (str): The API endpoint to fetch data from.
        parameters (dict): The parameters to include in the API request.

    Returns:
        dict: The parsed JSON response from the API, or an error message if the request fails.
    """
    coin_api_key = os.getenv('COIN_API_KEY')
    coin_api_base_url = "https://pro-api.coinmarketcap.com"
    headers = {'Accepts': 'application/json', "X-CMC_PRO_API_KEY": coin_api_key}

    try:
        response = requests.get(f"{coin_api_base_url}{endpoint}", headers=headers, params=parameters)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        return {"error": f"HTTP error occurred: {http_err}"}
    except requests.exceptions.ConnectionError as conn_err:
        return {"error": f"Connection error occurred: {conn_err}"}
    except requests.exceptions.Timeout as timeout_err:
        return {"error": f"Timeout error occurred: {timeout_err}"}
    except requests.exceptions.RequestException as req_err:
        return {"error": f"An error occurred: {req_err}"}


# ========================== TOKEN MANAGEMENT ==========================

def add_token_to_database(encoded_token):
    """Add a JWT token to the database for tracking and revocation."""
    decoded_token = decode_token(encoded_token)
    db_token = TokenBlocklist(
        jti=decoded_token["jti"],
        token_type=decoded_token["type"],
        user_id=decoded_token[current_app.config['JWT_IDENTITY_CLAIM']],
        expires=datetime.fromtimestamp(decoded_token["exp"]),
    )
    db.session.add(db_token)
    db.session.commit()


def is_token_revoked(jwt_payload):
    """Check whether a token has been revoked."""
    try:
        token = TokenBlocklist.query.filter_by(jti=jwt_payload["jti"]).one()
        return token.revoked_at is not None
    except NoResultFound:
        return True


def revoke_token(token_jti, user):
    """Mark a token as revoked in the database."""
    try:
        token = TokenBlocklist.query.filter_by(jti=token_jti, user_id=user).one()
        token.revoked_at = datetime.utcnow()
        db.session.commit()
    except NoResultFound:
        raise TokenNotFoundError(f"Token {token_jti} not found")


# ========================== DATA TRANSFORMATION ==========================

def transform_data(data, key_mapper=None):
    """
    Transform cryptocurrency data into a formatted dictionary.

    Args:
    - data (list | dict): The raw API response data.
    - key_mapper (callable): Optional function to map dictionary keys.

    Returns:
    - list: A list of formatted cryptocurrency data.
    """
    formatted_data = []
    for item in (data if isinstance(data, list) else data.values()):
        usd_quote = item['quote']['USD']
        formatted_data.append({
            "id": item['id'],
            "name": item['name'],
            "symbol": item['symbol'],
            "price": round(usd_quote['price'], 2),
            "percent_change_1h": round(usd_quote['percent_change_1h'], 2),
            "percent_change_24h": round(usd_quote['percent_change_24h'], 2),
            "percent_change_7d": round(usd_quote['percent_change_7d'], 2),
            "market_cap": round(usd_quote['market_cap'], 2),
            "volume_24h": round(usd_quote['volume_24h'], 2),
            "circulating_supply": item['circulating_supply']
        })
    return formatted_data


def transform_tips(tips):
    """Transform Tip objects into JSON-serializable dictionaries."""
    return [
        {
            "id": tip.id,
            "title": tip.title,
            "description": tip.description,
            "created_at": tip.created_at.isoformat(),
            "image": tip.image,
            "category": tip.category
        }
        for tip in tips
    ]
