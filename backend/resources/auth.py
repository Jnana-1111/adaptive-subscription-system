from flask import request
from flask_restful import Resource

from extensions import db, bcrypt
from models.user import User

from flask_jwt_extended import create_access_token

from common.response import api_response
from common.validators import is_valid_email, is_strong_password


class RegisterUser(Resource):
    def post(self):
        data = request.get_json()

        if not data:
            return api_response(False, 400, "Invalid request body")

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return api_response(False, 400, "All fields required")

        if not is_valid_email(email):
            return api_response(False, 400, "Invalid email")

        if not is_strong_password(password):
            return api_response(False, 400, "Weak password")

        if User.query.filter_by(email=email).first():
            return api_response(False, 409, "User exists")

        hashed = bcrypt.generate_password_hash(password).decode("utf-8")

        user = User(name=name, email=email, password=hashed)
        db.session.add(user)
        db.session.commit()

        return api_response(True, 201, "Registered")


class LoginUser(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(email=data.get("email")).first()

        if not user:
            return api_response(False, 401, "Invalid credentials")

        if not bcrypt.check_password_hash(user.password, data.get("password")):
            return api_response(False, 401, "Invalid credentials")

        token = create_access_token(identity=str(user.id))

        return api_response(True, 200, "Login success", {"access_token": token})