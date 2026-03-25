from flask import request
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity
from extensions import db
from models.product import Product
from models.subscription import Subscription
from models.user import User
from common.response import api_response
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required

# ✅ Helper functions
def get_next_billing_date(frequency):
    now = datetime.utcnow()
    if frequency == "daily":
        return now + timedelta(days=1)
    elif frequency == "weekly":
        return now + timedelta(weeks=1)
    elif frequency == "monthly":
        return now + timedelta(days=30)


def get_user_type(subscription_count):
    if subscription_count >= 5:
        return "gold"
    elif subscription_count >= 3:
        return "silver"
    return "normal"


def get_discount(user_type):
    if user_type == "gold":
        return 20
    elif user_type == "silver":
        return 10
    return 5


# ✅ MAIN CLASS
class SubscriptionResource(Resource):
    @jwt_required()

    def post(self):   # 🔥 EVERYTHING MUST BE INSIDE THIS FUNCTION

        user_id = get_jwt_identity()   # ✅ defined here

        data = request.get_json()

        product_id = data.get("product_id")
        frequency = data.get("frequency")

        if not product_id or not frequency:
            return api_response(False, 400, "product_id and frequency required")

        product = Product.query.get(product_id)

        if not product:
            return api_response(False, 404, "Product not found")

        # ✅ Get user
        user = User.query.get(user_id)

        # ✅ Count subscriptions
        sub_count = Subscription.query.filter_by(user_id=user_id).count()

        # ✅ Decide user type
        user_type = get_user_type(sub_count)
        user.user_type = user_type

        # ✅ Get discount
        discount = get_discount(user_type)

        # ✅ Calculate price
        discounted_price = product.price - (product.price * discount / 100)

        # ✅ Billing date
        next_billing_date = get_next_billing_date(frequency)

        # ✅ Save subscription
        sub = Subscription(
            user_id=user_id,
            product_id=product_id,
            frequency=frequency,
            original_price=product.price,
            discounted_price=discounted_price,
            next_billing_date=next_billing_date
        )

        db.session.add(sub)
        db.session.commit()

        return api_response(True, 201, "Subscription created", {
            "user_type": user_type,
            "discount": f"{discount}%",
            "discounted_price": discounted_price,
            "next_billing_date": next_billing_date.isoformat()
        })