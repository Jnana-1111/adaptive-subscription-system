from flask import Flask
from common.config import Config
from extensions import db, bcrypt, jwt

from flask_restful import Api
from flask_cors import CORS
from resources.user import CurrentUser

# ✅ Import resources
from resources.auth import RegisterUser, LoginUser
from resources.product import ProductResource
from resources.subscription import SubscriptionResource   # ✅ NEW
from resources.discount import DiscountByUser
from resources.add_to_cart import AddToCartResource
from resources.get_cart import GetCartResource
from resources.remove_item_from_cart import RemoveItemResource
from resources.update_quantity import UpdateQuantityResource
from resources.delete_cart_item import CartItemDelete 

# ✅ Create app
app = Flask(__name__)
#CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


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
api.add_resource(SubscriptionResource, "/subscriptions")  
api.add_resource(CurrentUser, "/me")
api.add_resource(DiscountByUser, "/discount-by-user")
api.add_resource(AddToCartResource, "/cart/add")
api.add_resource(GetCartResource, "/cart/<string:user_id>")
api.add_resource(RemoveItemResource, "/cart/remove/<string:user_id>/<string:product_id>")
api.add_resource(UpdateQuantityResource, "/cart/update/"
"<string:user_id>/<string:product_id>")
api.add_resource(
    CartItemDelete,
    "/cart/<string:user_id>/<int:product_id>"
)


# ✅ Debug routes
print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True)