import hmac
import hashlib
from flask import request
from flask_restful import Resource
from models.orders import Order
from extensions import db

KEY_SECRET = "cNuOk0kJ68wzSLFrQcFQAKLN"  # move to env later

class VerifyPayment(Resource):
    def post(self):
        data = request.get_json()

        razorpay_order_id = data["razorpay_order_id"]
        razorpay_payment_id = data["razorpay_payment_id"]
        razorpay_signature = data["razorpay_signature"]

        msg = f"{razorpay_order_id}|{razorpay_payment_id}"

        generated_signature = hmac.new(
            bytes(KEY_SECRET, "utf-8"),
            bytes(msg, "utf-8"),
            hashlib.sha256
        ).hexdigest()

        order = Order.query.filter_by(
            razorpay_order_id=razorpay_order_id
        ).first()

        if generated_signature == razorpay_signature:
            order.razorpay_payment_id = razorpay_payment_id
            order.status = "paid"
            db.session.commit()

            return {"status": "success"}, 200

        else:
            order.status = "failed"
            db.session.commit()

            return {"status": "failed"}, 400