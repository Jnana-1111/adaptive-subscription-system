# auth.py
from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db, bcrypt
from models.user import User


class RegisterUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return {"message": "No input data provided"}, 400

            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            password = data.get("password", "").strip()

            if not name or not email or not password:
                return {"message": "Name, email, and password are required"}, 400

            # Check if email already exists
            if User.query.filter_by(email=email).first():
                return {"message": "Email already registered"}, 400

            # Hash the password using bcrypt
            hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

            # Create new user
            new_user = User(name=name, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            return {"message": "User registered successfully"}, 201

        except Exception as e:
            print("RegisterUser Error:", e)
            return {"message": "Server error"}, 500

# ------------------ Login ------------------
class LoginUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return {"message": "No input data provided"}, 400

            email = data.get("email", "").strip()
            password = data.get("password", "").strip()

            if not email or not password:
                return {"message": "Email and password are required"}, 400

            user = User.query.filter_by(email=email).first()
            if not user:
                return {"message": "User not found"}, 404

            # ✅ Verify password
            if not bcrypt.check_password_hash(user.password, password):
                return {"message": "Invalid password"}, 401

            # ✅ FIX: identity MUST be string
            token = create_access_token(
                identity=str(user.id),   # 🔥 IMPORTANT FIX
                additional_claims={
                    "usertype": user.user_type
                }
            )

            return {
                "access_token": token,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "user_type": user.user_type
                }
            }, 200

        except Exception as e:
            print("LoginUser Error:", e)
            return {"message": "Server error"}, 500
