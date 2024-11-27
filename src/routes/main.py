from flask import request, jsonify, Blueprint, current_app
from src import cache  # Ensure cache is initialized
import requests
import os

main_blueprint = Blueprint("main", __name__, url_prefix="/api/v1")

COIN_API_KEY = os.getenv('COIN_API_KEY')
COIN_API_BASE_URL = "https://pro-api.coinmarketcap.com"


@main_blueprint.route('/', methods=['GET'])
def home():
    """
    Fetch and return cryptocurrency data similar to CoinMarketCap's homepage with caching and pagination.
    """
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    start = (page - 1) * limit
    end = start + limit
    parameters = {
        'start': start + 1,
        'limit': limit,
        'convert': 'USD'
    }
    cached_data = cache.get("cryptocurrencies")
    if not cached_data:
        # Fetch data from CoinMarketCap API
        headers = {'Accepts': 'application/json', "X-CMC_PRO_API_KEY": COIN_API_KEY}
        response = requests.get(f"{COIN_API_BASE_URL}/v1/cryptocurrency/listings/latest", headers=headers, params=parameters)

        if response.status_code != 200:
            return jsonify({
                "error": "Failed to fetch data from CoinMarketCap API",
                "status_code": response.status_code,
                "message": response.json().get("status", {}).get("error_message", "Unknown error")
            }), 500

        api_data = response.json()
        cryptocurrencies = api_data.get("data", [])  # Extract the list of cryptocurrencies
        total_count = api_data.get("status", {}).get("total_count", 0)  # Get total count of cryptocurrencies

        # Cache the data
        cache.set("cryptocurrencies", cryptocurrencies, timeout=60)
    else:
        cryptocurrencies = cached_data
        total_count = len(cryptocurrencies)  # Fallback if no total count is available

    transformed_data = transform_data(cryptocurrencies)
    return jsonify({
        "page": page,
        "limit": limit,
        "total": total_count,
        "data": transformed_data
    }), 200


@main_blueprint.route('/coin/<coin_id>', methods=['GET'])
def get_coin_data(coin_id):
    """
    Fetch cryptocurrency data for a specific coin by ID
    and return current and historical data (if available).
    """
    try:
        # Get current data for the coin
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': COIN_API_KEY
        }

        # Fetch current data for the coin
        current_response = requests.get(f"{COIN_API_BASE_URL}/v2/cryptocurrency/info", headers=headers, params={'id': coin_id})
        current_data = current_response.json()
        coin_info = current_data.get('data', {}).get(coin_id, {})

        if not coin_info:
            return jsonify({"error": "Coin data not found"}), 404

        return jsonify(coin_info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def transform_data(response):
    formatted_data = []
    for item in response:
        formatted_data.append({
            "id": item['id'],
            "name": item['name'],
            "symbol": item['symbol'],
            "price": round(item['quote']['USD']['price'], 2),
            "percent_change_1h": round(item['quote']['USD']['percent_change_1h'], 2),
            "percent_change_24h": round(item['quote']['USD']['percent_change_24h'], 2),
            "percent_change_7d": round(item['quote']['USD']['percent_change_7d'], 2),
            "market_cap": round(item['quote']['USD']['market_cap'], 2),
            "volume_24h": round(item['quote']['USD']['volume_24h'], 2),
            "circulating_supply": item['circulating_supply']
        })
    return {"data": formatted_data}
