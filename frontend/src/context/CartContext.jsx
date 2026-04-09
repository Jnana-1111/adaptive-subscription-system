import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [username, setUsername] = useState(null);

  // Coupon
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  // Get username from localStorage
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user && user !== "undefined") setUsername(user);
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch cart from backend
  const fetchCart = async (user) => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/cart/${user}`);
      setCart(res.data.items || []);
    } catch (err) {
      console.error("❌ Fetch cart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    if (username) fetchCart(username);
  }, [username]);

  // Add to Cart
  const addToCart = async (product) => {
    if (!username) {
      toast.error("Please login first", { style: { background: "#232f3e", color: "#fff" } });
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        {
          userId: username,
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      fetchCart(username);

      toast.success("Added to Cart 🛒", {
        style: { background: "#232f3e", color: "#fff" },
      });
    } catch (err) {
      console.error("❌ addToCart error:", err.response?.data || err);
      toast.error("Failed to add item", { style: { background: "#ff4d4d", color: "#fff" } });
    }
  };

  // Wishlist
  const addToWishlist = (item) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.productId === item.productId)) return prev;
      toast.success("Added to Wishlist ❤️", { style: { background: "#fff", color: "#000" } });
      return [...prev, item];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => {
      const newList = prev.filter((i) => i.productId !== productId);
      toast("Removed from Wishlist ❌", { style: { background: "#fff", color: "#000" }, icon: "💔" });
      return newList;
    });
  };

  // Update Quantity
  const updateQuantity = async (productId, type) => {
    try {
      const item = cart.find((i) => i.productId === productId);
      if (!item) return;

      const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
      if (newQty < 1) return;

      await axios.put(`http://localhost:5000/cart/update/${username}/${productId}`, { quantity: newQty });
      fetchCart(username);
    } catch (err) {
      console.error("❌ Quantity update error:", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const itemToRemove = cart.find((i) => i.productId === productId);
      if (!itemToRemove) return;

      await axios.delete(`http://localhost:5000/cart/remove/${username}/${productId}`);
      fetchCart(username);

      if (itemToRemove) addToWishlist(itemToRemove);
      toast("Item moved to Wishlist ❤️", { style: { background: "#fff", color: "#000" } });
    } catch (err) {
      console.error("❌ Remove error:", err);
    }
  };

  // Coupon
  const applyCoupon = () => {
    if (couponCode === "SAVE10") setDiscount(10);
    else if (couponCode === "SAVE20") setDiscount(20);
    else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - (subtotal * discount) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        addToWishlist,
        removeFromWishlist,
        updateQuantity,
        removeFromCart,
        subtotal,
        total,
        discount,
        couponCode,
        setCouponCode,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);