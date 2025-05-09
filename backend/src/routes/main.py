from flask import request, jsonify, Blueprint, current_app
from sqlalchemy.exc import NoResultFound
from src import cache
import requests
import os

from src.models import Tip
from src.utils.data_format_utils import transform_data

main_blueprint = Blueprint("main", __name__, url_prefix="/api/v1")

COIN_API_KEY = os.getenv('COIN_API_KEY')
COIN_API_BASE_URL = "https://pro-api.coinmarketcap.com"


@main_blueprint.route('', methods=['GET'])
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
        headers = {'Accepts': 'application/json',
                   "X-CMC_PRO_API_KEY": COIN_API_KEY}
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

        cache.set(cache_key, {"data": cryptocurrencies,
                  "total_count": total_count}, timeout=60)
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
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        pagination = Tip.query.filter_by(is_active=True).paginate(
            page=page, per_page=limit, error_out=False)

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
                    "updated_at": tip.updated_at.isoformat(),
                    "image": tip.image,
                    "category": tip.category,
                    "is_active": tip.is_active
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
                    "category": tip.category,
                    "is_active": tip.is_active
                }]

        }), 200

    except NoResultFound:
        return jsonify({"error": "No tips found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main_blueprint.route('/search', methods=['GET'])
def search_cryptocurrencies():
    """
    Search cryptocurrencies by name, symbol, or slug with pagination.
    """
    query = request.args.get('q', '').lower()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    start = (page - 1) * limit

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    # Try to get from cache first
    cache_key = f"search_{query}_page_{page}_limit_{limit}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return jsonify(cached_data)

    # Fetch data from CoinMarketCap API
    headers = {'Accepts': 'application/json',
               "X-CMC_PRO_API_KEY": COIN_API_KEY}
    response = requests.get(f"{COIN_API_BASE_URL}/v1/cryptocurrency/listings/latest",
                            headers=headers,
                            params={'limit': 5000, 'convert': 'USD'})

    if response.status_code != 200:
        return jsonify({
            "error": "Failed to fetch data from CoinMarketCap API",
            "status_code": response.status_code,
            "message": response.json().get("status", {}).get("error_message", "Unknown error")
        }), 500

    api_data = response.json()
    cryptocurrencies = api_data.get("data", [])

    # 🔹 Search by name, symbol, or slug
    filtered_cryptos = [
        crypto for crypto in cryptocurrencies
        if query in crypto['name'].lower() or query in crypto['symbol'].lower() or query in crypto['slug'].lower()
    ]

    # Pagination Logic
    total_results = len(filtered_cryptos)
    paginated_cryptos = filtered_cryptos[start:start + limit]

    # Transform the filtered and paginated data
    transformed_data = transform_data(paginated_cryptos)

    # Cache the results for 5 minutes
    cache.set(cache_key, {
        "page": page,
        "limit": limit,
        "total_results": total_results,
        "total_pages": (total_results // limit) + (1 if total_results % limit > 0 else 0),
        "data": transformed_data
    }, timeout=60)

    return jsonify({
        "page": page,
        "limit": limit,
        "total_results": total_results,
        "total": (total_results // limit) + (1 if total_results % limit > 0 else 0),
        "data": transformed_data
    })
