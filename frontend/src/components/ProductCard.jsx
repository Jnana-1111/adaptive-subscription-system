import React from "react";
import axios from "axios";

const ProductCard = ({ product, setUsertype }) => {

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Step 1: Create subscription
      await axios.post(
        "http://localhost:5000/subscriptions",
        {
          product_id: product?.id,
          frequency: "monthly"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // ✅ Step 2: Fetch updated user data
      const res = await axios.get(
        "http://localhost:5000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ Step 3: Update UI instantly
      if (setUsertype) {
        setUsertype(res.data.user_type);
      }

      alert("Subscription successful!");

    } catch (err) {
      console.error("Subscription Error:", err.response?.data || err.message);

      alert(
        err.response?.data?.msg ||
        "Subscription failed. Check console."
      );
    }
  };

  return (
    <div style={styles.card}>
      <h3>{product?.name}</h3>
      <p>Price: ₹{product?.price}</p>

      <button onClick={handleSubscribe} style={styles.button}>
        Subscribe
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "16px",
    margin: "10px",
    borderRadius: "8px",
    width: "200px"
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ProductCard;