from flask import request, jsonify, Blueprint, current_app
from sqlalchemy.exc import NoResultFound

from src import cache  # Ensure cache is initialized
import requests
import os

from src.models import Tip

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
    parameters = {
        'start': start + 1,
        'limit': limit,
        'convert': 'USD'
    }
    cache_key = f"cryptocurrencies_page_{page}_limit_{limit}"
    cached_data = cache.get(cache_key)
    if not cached_data:
        # Fetch data from CoinMarketCap API
        headers = {'Accepts': 'application/json', "X-CMC_PRO_API_KEY": COIN_API_KEY}
        response = requests.get(f"{COIN_API_BASE_URL}/v1/cryptocurrency/listings/latest", headers=headers,
                                params=parameters)

        if response.status_code != 200:
            return jsonify({
                "error": "Failed to fetch data from CoinMarketCap API",
                "status_code": response.status_code,
                "message": response.json().get("status", {}).get("error_message", "Unknown error")
            }), 500

        api_data = response.json()
        cryptocurrencies = api_data.get("data", [])
        total_count = api_data.get("status", {}).get("total_count", 0)

        cache.set(cache_key, {"data": cryptocurrencies, "total_count": total_count}, timeout=60)
    else:
        cryptocurrencies = cached_data.get("data", [])
        total_count = cached_data.get("total_count", 0)

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
        current_response = requests.get(f"{COIN_API_BASE_URL}/v2/cryptocurrency/info", headers=headers,
                                        params={'id': coin_id})
        current_data = current_response.json()
        coin_info = current_data.get('data', {}).get(coin_id, {})

        if not coin_info:
            return jsonify({"error": "Coin data not found"}), 404

        return jsonify(coin_info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main_blueprint.route('/tips', methods=['GET'])
def tips():
    """
    Endpoint to fetch paginated tips.
    """
    try:
        # Get page and limit parameters from the request
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))

        pagination = Tip.query.filter_by(is_active=True).paginate(page=page, per_page=limit, error_out=False)
        tips_data = pagination.items

        # Prepare the response with pagination metadata
        return jsonify({
            "page": pagination.page,
            "total_pages": pagination.pages,
            "total_items": pagination.total,
            "limit": limit,
            "data": [
                {
                    "id": tip.id,
                    "title": tip.title,
                    "description": tip.description,
                    "created_at": tip.created_at.isoformat(),
                    "image": tip.image,
                    "category": tip.category
                }
                for tip in tips_data
            ]
        }), 200

    except NoResultFound:
        return jsonify({"error": "No tips found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main_blueprint.route('/tips/<int:tip_id>', methods=['GET'])
def show_tip(tip_id):
    """
    Endpoint to fetch tip information.
    """
    try:
        tip = Tip.query.get_or_404(tip_id)
        return jsonify({
            "data":
                [{
                    "id": tip.id,
                    "title": tip.title,
                    "description": tip.description,
                    "created_at": tip.created_at.isoformat(),
                    "image": tip.image,
                    "category": tip.category
                }]

        }), 200

    except NoResultFound:
        return jsonify({"error": "No tips found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def format_price(price):
    if price == 0:
        return 0
    elif price < 0.00000001:
        return round(price, 11)
    elif price < 0.0001:
        return round(price, 8)  # Small numbers, retain 8 decimal places
    elif price < 1:
        return round(price, 4)  # Moderate numbers, retain 4 decimal places
    else:
        return round(price, 2)  # Larger numbers, retain 2 decimal places


def transform_data(response):
    formatted_data = []
    for item in response:
        formatted_data.append({
            "id": item['id'],
            "name": item['name'],
            "symbol": item['symbol'],
            "price": format_price(item['quote']['USD']["price"]),
            "percent_change_1h": round(item['quote']['USD']['percent_change_1h'], 2),
            "percent_change_24h": round(item['quote']['USD']['percent_change_24h'], 2),
            "percent_change_7d": round(item['quote']['USD']['percent_change_7d'], 2),
            "market_cap": round(item['quote']['USD']['market_cap'], 2),
            "volume_24h": round(item['quote']['USD']['volume_24h'], 2),
            "circulating_supply": item['circulating_supply']
        })
    return {"data": formatted_data}
