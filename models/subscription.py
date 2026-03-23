from extensions import db

class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    frequency = db.Column(db.String(20), nullable=False)
    original_price = db.Column(db.Float, nullable=False)
    discounted_price = db.Column(db.Float, nullable=False)
    next_billing_date = db.Column(db.DateTime, nullable=False)