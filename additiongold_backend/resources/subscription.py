from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Product, Subscription
from extensions import db
from datetime import datetime, timedelta


class SubscriptionResource(Resource):

    @jwt_required()
    def post(self):
        try:
            data = request.get_json()

            # ✅ Validate request body
            if not data:
                return {"msg": "No input data provided"}, 400

            product_id = data.get("product_id")
            frequency = data.get("frequency")

            print("DATA:", data)

            if product_id is None or frequency is None:
                return {"msg": "product_id and frequency are required"}, 422

            # ✅ Convert product_id
            try:
                product_id = int(product_id)
            except:
                return {"msg": "Invalid product_id"}, 422

            # ✅ Normalize frequency
            frequency = frequency.strip().lower()
            if frequency not in ["monthly", "yearly"]:
                return {"msg": "Invalid frequency"}, 422

            # ✅ Get user from JWT
            user_id = int(get_jwt_identity())

            # ✅ Validate user
            user = User.query.get(user_id)
            if not user:
                return {"msg": "User not found"}, 404

            # ✅ Validate product
            product = Product.query.get(product_id)
            if not product:
                return {"msg": "Product not found"}, 404

            # ✅ Prevent duplicate subscription
            existing = Subscription.query.filter_by(
                user_id=user_id,
                product_id=product_id
            ).first()

            if existing:
                return {"msg": "Already subscribed"}, 409

            # ✅ Price handling (fix NOT NULL error)
            original_price = product.price
            discounted_price = product.price  # modify if discount logic added

            # ✅ Billing date calculation
            if frequency == "monthly":
                next_billing_date = datetime.utcnow() + timedelta(days=30)
            else:
                next_billing_date = datetime.utcnow() + timedelta(days=365)

            # ✅ Create subscription
            subscription = Subscription(
                user_id=user_id,
                product_id=product_id,
                frequency=frequency,
                original_price=original_price,
                discounted_price=discounted_price,
                next_billing_date=next_billing_date
            )

            db.session.add(subscription)
            db.session.flush()  # ✅ ensures new subscription is counted

            # ✅ Dynamic user_type update
            subscription_count = Subscription.query.filter_by(user_id=user_id).count()

            if subscription_count >= 5:
                user.user_type = "gold"
            elif subscription_count >= 3:
                user.user_type = "silver"
            else:
                user.user_type = "normal"

            print("Updated user type:", user.user_type)

            # ✅ Commit all changes
            db.session.commit()

            return {
                "msg": "Subscription successful",
                "subscription": {
                    "id": subscription.id,
                    "user_id": user_id,
                    "product_id": product_id,
                    "frequency": frequency,
                    "original_price": original_price,
                    "discounted_price": discounted_price,
                    "next_billing_date": str(next_billing_date)
                },
                "user_type": user.user_type,
                "subscription_count": subscription_count
            }, 201

        except Exception as e:
            print("Subscription Error:", e)
            return {"msg": "Server error"}, 500