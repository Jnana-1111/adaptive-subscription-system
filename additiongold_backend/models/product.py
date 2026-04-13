from extensions import db   # ✅ NO indentation here

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255)) 
    flat_discount = db.Column(db.Float, default=0)