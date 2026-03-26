from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required

class SubscriptionResource(Resource):

    @jwt_required()
    def post(self):
        data = request.get_json()
        print("Incoming:", data)

        if not data:
            return {"error": "No JSON received"}, 422

        product_id = data.get("product_id")
        frequency = data.get("frequency")

        if product_id is None or not frequency:
            return {"error": "Missing product_id or frequency"}, 422

        # ✅ Dummy response (replace with DB logic later)
        return {
            "message": "Subscription created",
            "data": {
                "user_type": "gold",
                "discount": "20%",
                "discounted_price": 87.96,
                "next_billing_date": "2026-04-25"
            }
        }, 201