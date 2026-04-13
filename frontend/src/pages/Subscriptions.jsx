import React, { useEffect, useState } from "react";
import axios from "axios";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.error("❌ Error fetching subscriptions:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 My Subscriptions</h2>

      {subscriptions.length === 0 ? (
        <p>No subscriptions yet</p>
      ) : (
        subscriptions.map((sub) => (
          <div
            key={sub.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{sub.product_name}</h3>
            <p>Frequency: {sub.frequency}</p>
            <p>Original Price: ₹{sub.original_price}</p>
            <p>Discounted Price: ₹{sub.discounted_price}</p>
            <p>Next Billing: {sub.next_billing_date}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Subscriptions;