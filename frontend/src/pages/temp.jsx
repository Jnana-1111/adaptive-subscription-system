import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    total,
    couponCode,
    setCouponCode,
    applyCoupon,
    discount
  } = useCart();

  const navigate = useNavigate(); // ✅ ADD THIS

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.productId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              {/* 🔥 Quantity Controls */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => updateQuantity(item.productId, "dec")}>➖</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, "inc")}>➕</button>
              </div>

              {/* 🔥 Remove */}
              <button
                onClick={() => removeFromCart(item.productId)}
                style={{
                  marginTop: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Remove ❌
              </button>
            </div>
          ))}

          {/* 🔥 COUPON SECTION */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          {/* 🔥 BILL SUMMARY */}
          <div style={{ marginTop: "20px" }}>
            <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
            <h3>Discount: {discount}%</h3>
            <h2>Total: ₹{total.toFixed(2)}</h2>
          </div>

          {/* 🔥 PROCEED TO CHECKOUT BUTTON */}
          <button
            onClick={() => navigate("/checkout")}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Proceed to Checkout ✅
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;