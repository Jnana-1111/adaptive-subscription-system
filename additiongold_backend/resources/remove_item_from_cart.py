from flask import request, jsonify
from flask_restful import Resource
from extensions import db
from models.cart import Cart
from models.cart_items import CartItem

class RemoveItemResource(Resource):
    def delete(self, user_id, product_id):
        user_id = user_id.lower()

        print("DELETE API HIT:", user_id, product_id)

        cart = Cart.query.filter_by(user_id=user_id).first()

        if not cart:
            return {"message": "Cart not found"}, 404

        item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=product_id
        ).first()

        if item:
            db.session.delete(item)
            db.session.commit()

        return {"message": "Item removed"}, 200