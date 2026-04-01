from flask_restful import Resource
from models.product import Product
from common.response import api_response


class ProductResource(Resource):
    def get(self):
        products = Product.query.all()

        result = [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "image_url": p.image_url  # ✅ ADDED
            }
            for p in products
        ]

        return api_response(True, 200, "Products fetched", result)

