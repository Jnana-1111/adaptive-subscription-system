from flask_cors import CORS
from flask import Flask
from common.config import Config
from extensions import db, bcrypt, jwt

from flask_restful import Api  # ✅ create here

from resources.auth import RegisterUser, LoginUser
from resources.product import ProductResource
from resources.subscription import SubscriptionResource

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# ✅ CREATE API HERE (not in extensions)
api = Api(app)

# ✅ Register APIs
api.add_resource(RegisterUser, "/register")
api.add_resource(LoginUser, "/login")
api.add_resource(ProductResource, "/products")
api.add_resource(SubscriptionResource, "/subscriptions")

print(app.url_map)  # debug

if __name__ == "__main__":
    app.run(debug=True)