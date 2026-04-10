import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useCart();

  // ✅ Move to cart with toast
  const handleMove = async (item) => {
    await addToCart(item);
    removeFromWishlist(item.productId);

    toast.success("Moved to Cart 🛒", {
      id: "move-cart", // prevents duplicate toast
    });
  };

  // ✅ Remove from wishlist with toast
  const handleRemove = (productId) => {
    removeFromWishlist(productId);

    toast("Removed from Wishlist ❌", {
      id: "remove-wishlist",
      icon: "💔",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>❤️ Wishlist</h2>

      <div style={styles.grid}>
        {wishlist.map((item) => (
          <div key={item.productId} style={styles.card}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <button onClick={() => handleMove(item)}>
              Move to Cart 🛒
            </button>

            <button onClick={() => handleRemove(item.productId)}>
              Remove ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    transition: "0.3s",
  },
};

export default Wishlist;