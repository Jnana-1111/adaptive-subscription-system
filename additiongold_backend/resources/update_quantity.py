from flask import request
from flask_restful import Resource
from models.cart import Cart
from models.cart_items import CartItem
from extensions import db

class UpdateQuantityResource(Resource):
    def put(self, user_id, product_id):
        try:
            data = request.get_json()
            quantity = data.get("quantity")

            print("🔥 Update Quantity:", user_id, product_id, quantity)

            cart = Cart.query.filter_by(user_id=user_id.lower()).first()

            if not cart:
                return {"message": "Cart not found"}, 404

            item = CartItem.query.filter_by(
                cart_id=cart.id,
                product_id=product_id
            ).first()

            if not item:
                return {"message": "Item not found"}, 404

            item.quantity = max(1, quantity)
            db.session.commit()

            return {"message": "Quantity updated"}, 200

        except Exception as e:
            print("❌ ERROR:", str(e))
            return {"error": str(e)}, 500