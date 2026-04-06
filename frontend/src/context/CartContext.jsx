import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const username = localStorage.getItem("username");
  const cartKey = `cart_${username}`;

  const [cart, setCart] = useState([]);

  // ✅ NEW: Coupon states
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  // ✅ Load cart on app start
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
  }, [cartKey]);

  // ✅ Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  // ✅ Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          quantity: 1
        }
      ];
    });
  };

  // ✅ Remove item
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Update quantity
  const updateQuantity = (id, type) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty =
            type === "inc"
              ? item.quantity + 1
              : item.quantity - 1;

          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  // ✅ NEW: Apply coupon
  const applyCoupon = (code) => {
    if (code === "SAVE10") {
      setDiscount(10);
    } else if (code === "SAVE20") {
      setDiscount(20);
    } else {
      setDiscount(0);
      alert("Invalid coupon");
    }
  };

  // ✅ NEW: Subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ UPDATED: Total after discount
  const total = subtotal - (subtotal * discount) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,        // ✅ NEW
        total,
        discount,        // ✅ NEW
        couponCode,      // ✅ NEW
        setCouponCode,   // ✅ NEW
        applyCoupon      // ✅ NEW
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);