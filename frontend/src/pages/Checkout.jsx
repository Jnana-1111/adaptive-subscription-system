import React from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, subtotal, total, discount } = useCart();

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Step 1: Create order from backend
      const res = await axios.post(
        "http://localhost:5000/create-order",
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order_id, amount } = res.data;

      // ✅ Step 2: Razorpay options
      const options = {
        key: "rzp_test_Scv68iqJGGmO45", // 🔥 replace with Razorpay key
        amount: amount,
        currency: "INR",
        name: "SmartKart",
        description: "Order Payment",
        order_id: order_id,

        handler: function (response) {
          console.log("Payment Success:", response);

          toast.success("Payment successful 🎉", {
            id: "payment-success",
          });
        },

        prefill: {
          name: "Customer",
          email: "test@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("❌ Payment error:", err);

      toast.error("Payment failed", {
        id: "payment-error",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧾 Checkout</h2>

      {/* Items */}
      {cart.map((item) => (
        <div key={item.product_id}>
          <p>{item.name} × {item.quantity}</p>
        </div>
      ))}

      {/* Summary */}
      <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
      <h3>Discount Applied: {discount}%</h3>
      <h2>Final Total: ₹{total.toFixed(2)}</h2>

      <button
        onClick={handlePayment}   // 🔥 IMPORTANT
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