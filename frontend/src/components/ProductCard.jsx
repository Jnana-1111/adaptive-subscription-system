import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product, setUsertype }) => {

  const [frequency, setFrequency] = useState("monthly");

  // ✅ USER-SPECIFIC CART
  const handleAddToCart = () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Please login first");
      return;
    }

    const cartKey = `cart_${username}`;

    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    cart.push(product);

    localStorage.setItem(cartKey, JSON.stringify(cart));

    alert("Added to cart 🛒");
  };

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/subscriptions`,
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
        `${import.meta.env.VITE_API_URL}/me`,
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
    <div className="card">

      

      <h3>{product?.name}</h3>
      <p>Price: ₹{product?.price}</p>

      <div>
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

      <button onClick={handleSubscribe}>
        Subscribe
      </button>

      <button onClick={handleAddToCart}>
        Add to Cart 🛒
      </button>

    </div>
  );
};

export default ProductCard;