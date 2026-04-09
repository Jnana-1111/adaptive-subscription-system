from extensions import db

class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("cart.id"))
    product_id = db.Column(db.String(100))
    name = db.Column(db.Text)
    price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    