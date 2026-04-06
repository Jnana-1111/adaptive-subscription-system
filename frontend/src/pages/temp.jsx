import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const Cart = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  const {
    cart,
    total,
    subtotal,
    discount,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeFromCart,
    updateQuantity
  } = useCart();

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="card">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              {/* ✅ Quantity Controls */}
              <div>
                <button onClick={() => updateQuantity(item.id, "dec")}>
                  -
                </button>

                <span style={{ margin: "0 10px" }}>
                  {item.quantity}
                </span>

                <button onClick={() => updateQuantity(item.id, "inc")}>
                  +
                </button>
              </div>

              {/* ✅ Remove */}
              <button onClick={() => removeFromCart(item.id)}>
                Remove ❌
              </button>
            </div>
          ))}

          {/* ✅ COUPON SECTION */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button onClick={() => applyCoupon(couponCode)}>
              Apply Coupon
            </button>
          </div>

          {/* ✅ ORDER SUMMARY */}
          <div className="total-box" style={{ marginTop: "20px" }}>
            <p>Subtotal: ₹{subtotal}</p>
            <p>Discount: {discount}%</p>
            <h3>Total: ₹{total}</h3>

            {/* 🔥 CHECKOUT BUTTON ADDED HERE */}
            <button
              style={{ marginTop: "10px" }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout 💳
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;