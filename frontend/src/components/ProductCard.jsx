import { useState } from "react";

function ProductCard({ product }) {
  const [frequency, setFrequency] = useState("monthly");

  // 🏷️ Extract data safely
  const name = product.name;
  const price = product.price;
  const discount = product.discount || 0;
  const userType = product.userType || "Normal";

  // 💰 Calculate discounted price
  const finalPrice = price - (price * discount) / 100;

  // 🏅 Badge UI
  const getBadge = () => {
    if (userType === "Gold") {
      return <span className="badge gold">🥇 Gold</span>;
    } else if (userType === "Silver") {
      return <span className="badge silver">🥈 Silver</span>;
    } else {
      return <span className="badge normal">🟢 Normal</span>;
    }
  };

  // 🔘 Subscribe API call
  const handleSubscribe = () => {
    fetch("http://localhost:5000/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        product_id: product.id,
        frequency: frequency
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Subscribed successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Subscription failed");
      });
  };

  return (
    <div className="card">
      <h3>{name}</h3>

      <p>Price: ₹{price}</p>

      <p>
        Discount: <b>{discount}%</b>
      </p>

      <p>
        Final Price: <b>₹{finalPrice}</b>
      </p>

      {/* 🏅 User Badge */}
      {getBadge()}

      {/* 🔽 Frequency Dropdown */}
      <div style={{ marginTop: "10px" }}>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* 🔘 Subscribe Button */}
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
}

export default ProductCard;