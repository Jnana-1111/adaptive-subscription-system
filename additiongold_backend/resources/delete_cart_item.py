from flask import request, jsonify
from flask_restful import Resource
from flask import request, jsonify
from flask_restful import Resource
from models.cart import Cart
from models.cart_items import CartItem
from extensions import db


class CartItemDelete(Resource):
    def delete(self, user_id, product_id):
        item = CartItem.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()

        if not item:
            return {"msg": "Item not found"}, 404

        db.session.delete(item)
        db.session.commit()

        return {"msg": "Deleted successfully"}, 200