import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [frequency, setFrequency] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useCart();

  const productId = product.id || product._id;
  const isInWishlist = wishlist.some((i) => i.productId === productId);

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  const handleSubscribe = async () => {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      if (!username || !token) {
        toast.error("Please login first");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/subscriptions",
        {
          user_id: username,
          product_id: productId,
          name: product.name,
          price: product.price,
          frequency: frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Subscription:", res.data);

      toast.success(`Subscribed (${frequency}) 🎉`, {
        id: "subscribe-success",
      });

    } catch (err) {
      console.error("❌ Subscription error:", err.response?.data || err);

      toast.error(err.response?.data?.msg || "Subscription failed", {
        id: "subscribe-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) removeFromWishlist(productId);
    else addToWishlist({ productId, name: product.name, price: product.price });
  };

  // ✅ safe fallback
  const discount = product.flat_discount || 0;
  const finalPrice =
    product.final_price !== undefined
      ? product.final_price
      : product.price - (product.price * discount) / 100;

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        padding: "15px",
        position: "relative",
        borderRadius: "10px",
        transition: "0.3s",
        background: "#fff",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Wishlist Icon */}
      <div
        onClick={toggleWishlist}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          cursor: "pointer",
          fontSize: "22px",
        }}
      >
        {isInWishlist ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "red",
            color: "white",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {discount}% OFF
        </div>
      )}

      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      {/* Product Info */}
      <h3 style={{ marginTop: "10px" }}>{product.name}</h3>

      {/* Price Section */}
      <p style={{ textDecoration: "line-through", color: "gray", margin: 0 }}>
        ₹{product.price}
      </p>

      <p style={{ fontWeight: "bold", fontSize: "18px", margin: "5px 0" }}>
        ₹{finalPrice}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          background: "#ff9900",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Add to Cart 🛒
      </button>

      {/* Subscribe Section */}
      <div style={{ marginTop: "10px" }}>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "6px",
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: "100%",
            padding: "8px",
            background: "#4caf50",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {loading ? "Subscribing..." : "Subscribe 🔔"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;