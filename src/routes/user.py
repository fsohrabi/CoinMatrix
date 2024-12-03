from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.utils.decorators import role_required
from src import cache, db
from src.models.watchlist import Watchlist
from src.utils.helpers import transform_data, fetch_coinmarketcap_data

user_blueprint = Blueprint("user", __name__, url_prefix="/api/v1")


@user_blueprint.route('/watchlist', methods=['GET'])
@jwt_required()
@role_required(["user"], "User access required")
def get_watchlist():
    """
    Retrieve the user's watchlist with cryptocurrency details.

    This endpoint fetches the user's watchlist, queries the CoinMarketCap API
    for cryptocurrency data if not cached, and transforms the data for the response.

    Returns:
        JSON response containing pagination details and the list of cryptocurrencies
        in the user's watchlist.
    """
    user_id = get_jwt_identity()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    if page < 1 or limit < 1:
        return jsonify({"error": "Page and limit must be positive integers"}), 400

    watchlist_pagination = Watchlist.query.filter_by(user_id=user_id).paginate(
        page=page, per_page=limit, error_out=False
    )
    watchlist = watchlist_pagination.items
    coins = [item.coin_id for item in watchlist]

    if not coins:
        return {"message": "No coin in watchlist found", "data": []}, 200

    # Use a more specific cache key
    cache_key = f"watchlist_cryptocurrencies_user_{user_id}"
    cached_data = cache.get(cache_key)

    if not cached_data:
        response = fetch_coinmarketcap_data('/v2/cryptocurrency/quotes/latest', {
            'id': coins,
            'convert': 'USD'
        })
        if "error" in response:
            return jsonify({
                "error": "Failed to fetch data from CoinMarketCap API",
                "message":  "Unknown error"
            }), 500

        cryptocurrencies = response.get("data", [])
        cache.set(cache_key, cryptocurrencies, timeout=60)
    else:
        cryptocurrencies = cached_data

    transformed_data = transform_data(cryptocurrencies)

    return jsonify({
        "page": watchlist_pagination.page,
        "total_pages": watchlist_pagination.pages,
        "total_items": watchlist_pagination.total,
        "limit": limit,
        "data": transformed_data
    }), 200


@user_blueprint.route('/watchlist', methods=['POST'])
@jwt_required()
@role_required(["user"], "User access required")
def add_to_watchlist():
    """
    Add a cryptocurrency to the user's watchlist.

    Validates the coin ID, fetches its data from CoinMarketCap to confirm existence,
    and adds it to the watchlist if it doesn't already exist.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    coin_id = data.get('coin_id')

    if not coin_id:
        return jsonify({"error": "Coin ID is required"}), 400

    # Check if the coin is already in the watchlist
    if Watchlist.query.filter_by(user_id=user_id, coin_id=coin_id).first():
        return jsonify({"error": "Coin already in watchlist"}), 400

    # Fetch coin data from the API
    parameters = {'id': coin_id}
    response = fetch_coinmarketcap_data('/v2/cryptocurrency/quotes/latest', parameters)
    if "error" in response:
        return jsonify({
            "error": "Invalid Coin ID",
            "details": response.get("error", "No further details")
        }), 400

    # Add the coin to the watchlist
    watchlist_item = Watchlist(user_id=user_id, coin_id=coin_id)
    db.session.add(watchlist_item)
    db.session.commit()

    return jsonify({"message": f"{coin_id} added to watchlist"}), 201


@user_blueprint.route('/watchlist/<string:coin_id>', methods=['DELETE'])
@jwt_required()
@role_required(["user"], "User access required")
def remove_from_watchlist(coin_id):
    """
    Remove a cryptocurrency from the user's watchlist.

    This endpoint checks if the specified coin ID exists in the user's watchlist
    and removes it.

    Args:
        coin_id (str): The ID of the cryptocurrency to remove.

    Returns:
        JSON response with a success message if the coin is removed successfully.
        Otherwise, returns an error message with the appropriate HTTP status code.
    """
    user_id = get_jwt_identity()
    watchlist_item = Watchlist.query.filter_by(user_id=user_id, coin_id=coin_id).first()

    if not watchlist_item:
        return jsonify({"error": "Coin not in watchlist"}), 404

    db.session.delete(watchlist_item)
    db.session.commit()
    return jsonify({"message": f"{coin_id} removed from watchlist"}), 200
