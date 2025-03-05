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
    if isinstance(response, dict):
        items = response.values()
    else:
        items = response

    for item in items:
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
