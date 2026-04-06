import React, { useState } from "react";
import coupons from "../data/coupons";
import { validateCoupon } from "../utils/couponUtils";

const Checkout = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ Total
  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const finalTotal = Math.max(0, total - discount);

  // ✅ Apply Coupon
  const handleApplyCoupon = () => {
    const result = validateCoupon(couponCode, coupons, total);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setDiscount(result.discount);
    setAppliedCoupon(result.coupon);

    alert("Coupon Applied ✅");
  };

  // ✅ Razorpay
  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    const options = {
      key: "YOUR_KEY",
      amount: finalTotal * 100,
      currency: "INR",
      name: "SmartKart",
      description: "Order Payment",

      handler: function (response) {
        alert("Payment Successful ✅");

        localStorage.removeItem("cart");
        window.location.href = "/success";
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.map((item, i) => (
        <div key={i}>
          {item.name} - ₹{item.price} x {item.quantity || 1}
        </div>
      ))}

      <hr />

      {/* ✅ Coupon UI */}
      <input
        type="text"
        placeholder="Enter Coupon"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button onClick={handleApplyCoupon}>Apply</button>

      {appliedCoupon && (
        <p style={{ color: "green" }}>
          Applied: {appliedCoupon.code} (-₹{discount})
        </p>
      )}

      <hr />

      <h3>Subtotal: ₹{total}</h3>
      <h3>Discount: -₹{discount}</h3>
      <h2>Final Total: ₹{finalTotal}</h2>

      <button onClick={handlePayment}>Pay Now 💳</button>
    </div>
  );
};

export default Checkout;