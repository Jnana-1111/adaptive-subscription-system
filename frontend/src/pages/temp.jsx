import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    deleteFromCart,
    subtotal,
    total,
    couponCode,
    setCouponCode,
    applyCoupon,
    discount
  } = useCart();

  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState({});

  const itemCount = cart.length;

  // ✅ FIXED
  useEffect(() => {
    const initial = {};
    cart.forEach((item) => {
      initial[item.product_id] = true;
    });
    setSelectedItems(initial);
  }, [cart]);

  // ✅ FIXED
  const toggleSelect = (product_id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [product_id]: !prev[product_id],
    }));
  };

  // ✅ FIXED
  const selectedCart = cart.filter(
    (item) => selectedItems[item.product_id]
  );

  const selectedSubtotal = selectedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedTotal =
    selectedSubtotal - (selectedSubtotal * discount) / 100;

  const handleRemoveFromCart = async (product_id) => {
    await removeFromCart(product_id);

    toast("Moved to Wishlist ❤️", {
      id: "move-wishlist",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      <div style={{ textAlign: "left", marginBottom: "10px" }}>
        <strong>
          {itemCount} × {itemCount} in your cart
        </strong>
      </div>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.product_id}   // ✅ FIXED
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={!!selectedItems[item.product_id]}  // ✅
                onChange={() => toggleSelect(item.product_id)} // ✅
              />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>

                {/* Quantity */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => updateQuantity(item.product_id, "dec")}>
                    ➖
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, "inc")}>
                    ➕
                  </button>
                </div>

                {/* ACTIONS */}
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

                  <button
                    onClick={() => handleRemoveFromCart(item.product_id)} // ✅
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    Remove ❌
                  </button>

                  <button
                    onClick={() => deleteFromCart(item.product_id)} // ✅🔥
                    style={{
                      background: "black",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* COUPON */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          {/* BILL */}
          <div style={{ marginTop: "20px" }}>
            <h3>Subtotal (Selected): ₹{selectedSubtotal.toFixed(2)}</h3>
            <h3>Discount: {discount}%</h3>
            <h2>Total: ₹{selectedTotal.toFixed(2)}</h2>
            <p>{selectedCart.length} item(s) selected</p>
          </div>

          {/* CHECKOUT */}
          <button
            onClick={() => navigate("/checkout")}
            disabled={selectedCart.length === 0}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: selectedCart.length === 0 ? "gray" : "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Proceed to Checkout ✅
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;