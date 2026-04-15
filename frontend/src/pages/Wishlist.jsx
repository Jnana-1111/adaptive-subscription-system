import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useCart();

  // ✅ FINAL FIX (disable default toast from addToCart)
  const handleMove = async (item) => {
    const productData = {
      productId: item.productId || item.id,
      name: item.name,
      price: item.price,
    };

    console.log("🚀 Moving item:", productData);

    // 🔥 IMPORTANT CHANGE HERE
    await addToCart(productData, false);  // ❌ disable "Added to Cart"

    removeFromWishlist(item.productId || item.id);

    // ✅ Only this toast will show
    toast.success("Moved to Cart 🛒", {
      id: "move-cart", // prevents duplicates
    });
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    toast("Removed ❌", {
      icon: "💔",
      id: "remove-wishlist",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>❤️ Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
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
      )}
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
  },
};

export default Wishlist;