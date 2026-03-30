from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        return {
            "username": user.name,
            "user_type": user.user_type
        }, 200