import requests
from extensions import db
from models.product import Product


def fetch_products():
    url = "https://fakestoreapi.com/products"

    try:
        response = requests.get(url)

        if response.status_code != 200:
            print("Failed to fetch products")
            return

        for item in response.json():
            if not Product.query.filter_by(name=item["title"]).first():
                db.session.add(Product(
                    name=item["title"],
                    price=item["price"]
                ))

        db.session.commit()
        print("Products synced")

    except Exception as e:
        print("Error:", str(e))