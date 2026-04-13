from flask_restful import Resource
from models.cart_items import CartItem
from extensions import db
from urllib.parse import unquote
import traceback

class CartItemDelete(Resource):
    def delete(self, cart_id, product_id):

        item = CartItem.query.filter_by(
            cart_id=cart_id,          # ✅ correct column
            product_id=product_id
        ).first()

        if not item:
            return {"msg": "Item not found"}, 404

        db.session.delete(item)
        db.session.commit()

        return {"msg": "Deleted successfully"}, 200