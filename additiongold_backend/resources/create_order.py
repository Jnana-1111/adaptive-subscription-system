import razorpay
from flask_restful import Resource
from flask import request

client = razorpay.Client(auth=("rzp_test_Scv68iqJGGmO45", "cNuOk0kJ68wzSLFrQcFQAKLN"))

class CreateOrder(Resource):
    def post(self):
        data = request.get_json()

        amount = int(float(data.get("amount")) * 100)  # paisa

        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })

        return {
            "order_id": order["id"],
            "amount": order["amount"]
        }, 200