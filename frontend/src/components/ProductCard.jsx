import React from "react";
import axios from "axios";

const ProductCard = ({ product, setUsertype }) => {

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login first");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/subscriptions",
        {
          product_id: product.id,
          frequency: "monthly",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SUB RESPONSE:", res.data);

      // ✅ Update usertype from backend
      const newType = res.data.data.user_type;

      // Save globally
      localStorage.setItem("usertype", newType);

      // Update UI instantly (no reload)
      setUsertype(newType);

      alert("Subscribed! You are now " + newType);

    } catch (err) {
      console.error(err);
      alert("Subscription failed");
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>

      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
};

export default ProductCard;