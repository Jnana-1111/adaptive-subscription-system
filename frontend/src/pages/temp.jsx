import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    deleteFromCart, // ✅ ADDED
    subtotal,
    total,
    couponCode,
    setCouponCode,
    applyCoupon,
    discount
  } = useCart();

  const navigate = useNavigate();

  // selected items state
  const [selectedItems, setSelectedItems] = useState({});

  const itemCount = cart.length;

  // auto-check all items
  useEffect(() => {
    const initial = {};
    cart.forEach((item) => {
      initial[item.productId] = true;
    });
    setSelectedItems(initial);
  }, [cart]);

  // toggle checkbox
  const toggleSelect = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // selected items
  const selectedCart = cart.filter(
    (item) => selectedItems[item.productId]
  );

  const selectedSubtotal = selectedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedTotal =
    selectedSubtotal - (selectedSubtotal * discount) / 100;

  const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId);

    toast("Moved to Wishlist ❤️", {
      id: "move-wishlist",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {/* N × N display */}
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
              key={item.productId}
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
                checked={!!selectedItems[item.productId]}
                onChange={() => toggleSelect(item.productId)}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>

                {/* Quantity Controls */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => updateQuantity(item.productId, "dec")}>
                    ➖
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, "inc")}>
                    ➕
                  </button>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

                  {/* Remove → wishlist */}
                  <button
                    onClick={() => handleRemoveFromCart(item.productId)}
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

                  {/* Delete → permanent */}
                  <button
                    onClick={() => deleteFromCart(item.productId)}
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

          {/* BILL SUMMARY */}
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