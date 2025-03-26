import logging
import os

import requests
from flask import request, Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError

from src.utils.decorators import user_required

from src.models.users import Watchlist
from src.schemas.watchlist import WatchlistSchema
from src.utils.data_format_utils import transform_data
from src import db
from sqlalchemy.exc import IntegrityError

user_blueprint = Blueprint("user", __name__, url_prefix="/api/v1/user")
COIN_API_KEY = os.getenv('COIN_API_KEY')
COIN_API_BASE_URL = "https://pro-api.coinmarketcap.com"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def fetch_coinmarketcap_data(coin_ids):
    """
    Fetches data from the CoinMarketCap API for the given coin IDs.
    """
    try:
        parameters = {'id': coin_ids}
        headers = {'Accepts': 'application/json', "X-CMC_PRO_API_KEY": COIN_API_KEY}
        response = requests.get(f"{COIN_API_BASE_URL}/v1/cryptocurrency/quotes/latest", headers=headers,
                                params=parameters)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch data from CoinMarketCap API: {e}")
        return None


def get_user_watchlist(user_id):
    """
    Fetches the watchlist for the given user ID.
    """
    return Watchlist.query.filter_by(user_id=user_id).all()


@user_blueprint.route("/watchlist", methods=["GET"])
@jwt_required()
@user_required
def watchlist():
    user_id = get_jwt_identity()
    watchlist_coins = get_user_watchlist(user_id)

    if not watchlist_coins:
        return jsonify({"message": "Nothing found"}), 404

    # Extract coin IDs
    coin_ids = ",".join(str(coin.coin_id) for coin in watchlist_coins)

    # Fetch data from CoinMarketCap API
    api_data = fetch_coinmarketcap_data(coin_ids)
    if not api_data:
        return jsonify({
            "error": "Failed to fetch data from CoinMarketCap API",
            "message": "Please try again later"
        }), 500

    # Transform and return the data
    cryptocurrencies = api_data.get("data", {})
    transformed_data = transform_data(cryptocurrencies)
    return jsonify(transformed_data), 200


def find_watchlist(user_id, coin_id):
    """
    Checks if an entry already exists in the watchlist for the given user and coin.
    """
    return Watchlist.query.filter_by(user_id=user_id, coin_id=coin_id).first() is not None


def add_to_watchlist(user_id, coin_id):
    """
    Adds a new entry to the watchlist.
    """
    try:
        watchlist_entry = Watchlist(user_id=user_id, coin_id=coin_id)
        db.session.add(watchlist_entry)
        db.session.commit()
        logger.info(f"New watchlist entry added: user_id={user_id}, coin_id={coin_id}")
        return True
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Database error while adding to watchlist: {e}")
        return False


@user_blueprint.route("/watchlist", methods=["POST"])
@jwt_required()
@user_required
def add_watchlist():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['user_id'] = user_id

    # Validate incoming data
    schema = WatchlistSchema()
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        logger.warning(f"Validation error: {err.messages}")
        return jsonify({"errors": err.messages}), 400

    coin_id = validated_data.get("coin_id")

    # Check for duplicate entry
    if find_watchlist(user_id, coin_id):
        logger.warning(f"Duplicate entry detected: user_id={user_id}, coin_id={coin_id}")
        return jsonify({"message": "Crypto is already in the watchlist"}), 400

    # Add to watchlist
    if add_to_watchlist(user_id, coin_id):
        return jsonify({"message": "Crypto added to watchlist successfully"}), 201
    else:
        return jsonify({"message": "Failed to add crypto to watchlist"}), 500


@user_blueprint.route("/watchlist", methods=["DELETE"])
@jwt_required()
@user_required
def delete_watchlist(coin_id):
    user_id = get_jwt_identity()
    watchlist = find_watchlist(user_id, coin_id)
    if watchlist:
        db.session.delete(watchlist)
        db.session.commit()
        return jsonify({'message': 'Coin  deleted successfully from watchlist'}), 200
