from extensions import db

class Cart(db.Model):
    __tablename__ = "cart"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)

    items = db.relationship(
        "CartItem",
        backref="cart",
        cascade="all, delete-orphan"
    )