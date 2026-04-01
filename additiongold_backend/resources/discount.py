from flask import request, jsonify
from flask_restful import Resource

class DiscountByUser(Resource):
    def get(self):
        usertype = request.args.get("usertype")

        # 🔥 Business Logic
        if usertype == "gold":
            discount = 30
        elif usertype == "premium":
            discount = 20
        elif usertype == "silver":
            discount = 15
        else:
            discount = 5

        return {
            "discount_percent": discount
        }, 200