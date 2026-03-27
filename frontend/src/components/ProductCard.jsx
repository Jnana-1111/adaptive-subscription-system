import React from "react";
import axios from "axios";

const ProductCard = ({ product }) => {

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Debug: check what you're sending
      console.log("Sending payload:", {
        product_id: product?.id,
        frequency: "monthly"
      });

      const res = await axios.post(
        "http://localhost:5000/subscriptions",
        {
          product_id: product?.id,     // ✅ safe access
          frequency: "monthly"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ SUCCESS:", res.data);

      alert("Subscription successful!");

    } catch (err) {
      // ✅ THIS IS IMPORTANT (as you asked)
      console.error("FULL ERROR:", err.response?.data || err.message);

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