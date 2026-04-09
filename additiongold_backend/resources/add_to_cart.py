from flask import request
from flask_restful import Resource
from extensions import db
from models.cart import Cart
from models.cart_items import CartItem
import traceback


class AddToCartResource(Resource):
    def post(self):
        try:
            data = request.get_json()

            print("🔥 Incoming data:", data)

            # ✅ DIRECT FIELDS FROM FRONTEND
            user_id = data.get("userId")
            product_id = data.get("productId")
            name = data.get("name")
            price = data.get("price")

            # ✅ VALIDATION
            if not user_id or not product_id or not name or price is None:
                return {"error": "Missing data"}, 400

            user_id = user_id.lower()

            # ✅ GET OR CREATE CART
            cart = Cart.query.filter_by(user_id=user_id).first()

            if not cart:
                cart = Cart(user_id=user_id)
                db.session.add(cart)
                db.session.commit()

            # ✅ FIND EXISTING ITEM
            item = CartItem.query.filter_by(
                cart_id=cart.id,
                product_id=str(product_id)
            ).first()

            if item:
                item.quantity += 1
            else:
                new_item = CartItem(
                    cart_id=cart.id,
                    product_id=str(product_id),
                    name=name,
                    price=float(price),
                    quantity=1
                )
                db.session.add(new_item)

            db.session.commit()

            return {
                "message": "Item added successfully",
                "productId": product_id
            }, 200

        except Exception as e:
            print("❌ ERROR OCCURRED:")
            traceback.print_exc()
            return {"error": str(e)}, 500