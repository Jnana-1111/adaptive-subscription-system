from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Subscription, Product

class GetSubscriptionsResource(Resource):

    @jwt_required()
    def get(self):
        try:
            user_id = int(get_jwt_identity())

            subscriptions = Subscription.query.filter_by(user_id=user_id).all()

            result = []

            for sub in subscriptions:
                product = Product.query.get(sub.product_id)

                result.append({
                    "id": sub.id,
                    "product_id": sub.product_id,
                    "product_name": product.name if product else "Unknown",
                    "frequency": sub.frequency,
                    "original_price": sub.original_price,
                    "discounted_price": sub.discounted_price,
                    "next_billing_date": str(sub.next_billing_date)
                })

            return {"subscriptions": result}, 200

        except Exception as e:
            print("❌ Fetch subscriptions error:", e)
            return {"msg": "Server error"}, 500