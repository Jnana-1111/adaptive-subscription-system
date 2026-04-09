import React from "react";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, subtotal, total, discount } = useCart();

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧾 Checkout</h2>

      {/* ✅ Show items */}
      {cart.map((item) => (
        <div key={item.productId}>
          <p>{item.name} × {item.quantity}</p>
        </div>
      ))}

      {/* ✅ Show summary (NO coupon here) */}
      <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
      <h3>Discount Applied: {discount}%</h3>
      <h2>Final Total: ₹{total.toFixed(2)}</h2>

      <button
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Pay Now 💳
      </button>
    </div>
  );
};

export default Checkout;