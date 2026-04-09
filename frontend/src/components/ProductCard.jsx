import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductCard = ({ product }) => {
  const [frequency, setFrequency] = useState("monthly");
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useCart();

  const productId = product.id || product._id;
  const isInWishlist = wishlist.some((i) => i.productId === productId);

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  const handleSubscribe = () => {
    console.log("Subscribe clicked for:", product.name, "Frequency:", frequency);
    // TODO: Call your subscription API here
    // Example: subscribeProduct(productId, frequency)
  };

  const toggleWishlist = () => {
    if (isInWishlist) removeFromWishlist(productId);
    else addToWishlist({ productId, name: product.name, price: product.price });
  };

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
        style={{ position: "absolute", top: 10, right: 10, cursor: "pointer", fontSize: "22px" }}
      >
        {isInWishlist ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
      </div>

      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
      />

      {/* Product Info */}
      <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
      <p style={{ fontWeight: "bold" }}>₹{product.price}</p>

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
          Subscribe 🔔
        </button>
      </div>
    </div>
  );
};

export default ProductCard;