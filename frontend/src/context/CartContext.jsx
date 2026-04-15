import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [username, setUsername] = useState(null);
  const [cartId, setCartId] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  // ✅ Get username
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user && user !== "undefined") setUsername(user);
  }, []);

  // ✅ Wishlist load/save
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ Fetch cart
  const fetchCart = async (user) => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/cart/${user}`);
      setCart(res.data.items || []);
      setCartId(res.data.cart_id);
    } catch (err) {
      console.error("❌ Fetch cart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    if (username) fetchCart(username);
  }, [username]);

  // ✅ UPDATED addToCart (SMART TOAST CONTROL)
  const addToCart = async (product, showToast = true) => {
    if (!username) {
      toast.error("Please login first");
      return;
    }

    const productId =
      product.productId || product.id || product._id;

    console.log("🛒 FINAL PAYLOAD:", {
      userId: username,
      productId,
      name: product.name,
      price: product.price,
    });

    if (!productId) {
      toast.error("Product ID missing ❌");
      return;
    }

    try {
      await axios.post("http://localhost:5000/cart/add", {
        userId: username,
        productId: productId,
        name: product.name,
        price: product.price,
      });

      fetchCart(username);

      // ✅ Only show toast when allowed
      if (showToast) {
        toast.success("Added to Cart 🛒");
      }

    } catch (err) {
      console.error("❌ addToCart error:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Add failed");
    }
  };

  // ✅ Wishlist
  const addToWishlist = (item) => {
    setWishlist((prev) => {
      const id = item.id || item.productId;

      if (prev.find((p) => p.productId === id)) return prev;

      return [
        ...prev,
        {
          productId: id,
          name: item.name,
          price: item.price,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((i) => i.productId !== productId)
    );
  };

  // Quantity
  const updateQuantity = async (productId, type) => {
    try {
      const item = cart.find((i) => i.product_id === productId);
      if (!item) return;

      const newQty =
        type === "inc" ? item.quantity + 1 : item.quantity - 1;

      if (newQty < 1) return;

      await axios.put(
        `http://localhost:5000/cart/update/${username}/${productId}`,
        { quantity: newQty }
      );

      fetchCart(username);
    } catch (err) {
      console.error(err);
    }
  };

  // Move/remove
  const removeFromCart = async (productId) => {
    try {
      const item = cart.find((i) => i.product_id === productId);
      if (!item) return;

      await axios.delete(
        `http://localhost:5000/cart/remove/${username}/${productId}`
      );

      fetchCart(username);
      setWishlist((prev) => [...prev, item]);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const deleteFromCart = async (productId) => {
    try {
      if (!cartId) return;

      await axios.delete(
        `http://localhost:5000/cart/${cartId}/${productId}`
      );

      fetchCart(username);
      toast.success("Item deleted 🗑️");
    } catch (err) {
      console.error(err);
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
        deleteFromCart,
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