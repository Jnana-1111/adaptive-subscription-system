
from extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    user_email = db.Column(db.String(255), nullable=False)

    razorpay_order_id = db.Column(db.String(255))
    razorpay_payment_id = db.Column(db.String(255))

    amount = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(10), default="INR")

    status = db.Column(db.String(20), default="created")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)