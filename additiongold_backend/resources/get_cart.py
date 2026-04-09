from flask import request, jsonify
from flask_restful import Resource
from models.cart import Cart
from models.cart_items import CartItem

class GetCartResource(Resource):
    def get(self, user_id):
        try:
            cart = Cart.query.filter_by(user_id=user_id.lower()).first()

            if not cart:
                return {"items": []}, 200

            items = CartItem.query.filter_by(cart_id=cart.id).all()

            result = []
            for item in items:
                result.append({
                    "productId": item.product_id,
                    "name": item.name,
                    "price": item.price,
                    "quantity": item.quantity
                })

            return {"items": result}, 200

        except Exception as e:
            print("❌ Fetch error:", e)
            return {"error": str(e)}, 500