import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product, setUsertype }) => {

  const [frequency, setFrequency] = useState("monthly");

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/subscriptions",
        {
          product_id: product?.id,
          frequency: frequency
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = await axios.get(
        "http://localhost:5000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (setUsertype) {
        setUsertype(res.data.user_type);
      }

      alert("Subscription successful!");

    } catch (err) {
      console.error("Subscription Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Subscription failed.");
    }
  };

  return (
    <div style={styles.card}>
      
      {/* ✅ PRODUCT IMAGE */}
      <img
        src={product?.image_url || "https://via.placeholder.com/200"}
        alt={product?.name}
        style={styles.image}
      />

      <h3>{product?.name}</h3>
      <p>Price: ₹{product?.price}</p>

      {/* Frequency */}
      <div style={{ marginBottom: "10px" }}>
        <label>Select Plan: </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

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
    borderRadius: "8px",
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px"
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

