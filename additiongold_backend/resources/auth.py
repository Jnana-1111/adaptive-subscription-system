from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models.user import User


# ✅ REGISTER USER
class RegisterUser(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # 🔍 Check if user already exists
        if User.query.filter_by(email=email).first():
            return {"message": "User already exists"}, 400

        # 🔐 Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        # 🆕 Create new user (default user_type = normal)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            user_type="normal"   # ✅ default
        )

        db.session.add(new_user)
        db.session.commit()

        return {"message": "User registered successfully"}, 201


# ✅ LOGIN USER
class LoginUser(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        # 🔍 Find user
        user = User.query.filter_by(email=email).first()

        # ❌ Invalid user
        if not user:
            return {"message": "User not found"}, 404

        # ❌ Wrong password
        if not bcrypt.check_password_hash(user.password, password):
            return {"message": "Invalid password"}, 401

        # 🔐 Create JWT token
        access_token = create_access_token(identity=user.id)

        # ✅ Return token + user info
        return {
            "message": "Login success",
            "data": {
                "access_token": access_token,
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type
                }
            }
        }, 200