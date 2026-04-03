import React from "react";

const Cart = () => {
  const username = localStorage.getItem("username");
  const cartKey = `cart_${username}`;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // ✅ TOTAL CALCULATION
  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
            </div>
          ))}

          <div className="total-box">
            Total: ₹{total}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;