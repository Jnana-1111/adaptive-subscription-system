from flask_restful import Resource
from models.cart import Cart
from models.cart_items import CartItem

class GetCartResource(Resource):
    def get(self, user_id):
        try:
            # 🔥 normalize (since you're using email as username)
            user_id = user_id.lower()

            cart = Cart.query.filter_by(user_id=user_id).first()

            # ✅ If no cart exists
            if not cart:
                return {
                    "cart_id": None,   # ✅ IMPORTANT
                    "items": []
                }, 200

            items = CartItem.query.filter_by(cart_id=cart.id).all()

            result = []
            for item in items:
                result.append({
                    "product_id": item.product_id,   # ✅ match frontend
                    "name": item.name,
                    "price": item.price,
                    "quantity": item.quantity
                })

            # ✅ RETURN cart_id (CRITICAL FIX)
            return {
                "cart_id": cart.id,   # ✅ REQUIRED for delete
                "items": result
            }, 200

        except Exception as e:
            print("❌ Fetch error:", e)
            return {"error": str(e)}, 500