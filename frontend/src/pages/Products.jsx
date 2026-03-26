import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    // ✅ Load user info from localStorage
    setUsername(localStorage.getItem("username") || "User");
    setUsertype(localStorage.getItem("usertype") || "normal");

    // ✅ Fetch products from backend
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");

        console.log("PRODUCTS API RESPONSE:", res.data);

        // 🔥 IMPORTANT FIX (based on your backend structure)
        if (res.data && res.data.data) {
          setProducts(res.data.data);  // ✅ Correct
        } else {
          setProducts([]); // fallback safety
        }

      } catch (err) {
        console.error("Product fetch error:", err);
        setProducts([]); // avoid crash
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* 🔹 Top Right User Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <strong>{username}</strong> ({usertype})
      </div>

      {/* 🔹 Products Section */}
      <div style={{ padding: "20px" }}>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              setUsertype={setUsertype}
            />
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Products;