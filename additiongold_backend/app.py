from flask import Flask
from common.config import Config
from extensions import db, bcrypt, jwt

from flask_restful import Api
from flask_cors import CORS

# ✅ Import resources
from resources.auth import RegisterUser, LoginUser
from resources.product import ProductResource
from resources.subscription import SubscriptionResource   # ✅ NEW

# ✅ Create app
app = Flask(__name__)
CORS(app)

# ✅ Load config
app.config.from_object(Config)

# ✅ Init extensions
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# ✅ Create API
api = Api(app)

# ✅ Register APIs
api.add_resource(RegisterUser, "/register")
api.add_resource(LoginUser, "/login")
api.add_resource(ProductResource, "/products")
api.add_resource(SubscriptionResource, "/subscriptions")  # ✅ NEW

# ✅ Debug routes
print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True)