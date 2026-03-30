import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    console.log("✅ Products component mounted");

    // ✅ FETCH USER (DYNAMIC - FROM BACKEND)
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("🔥 TOKEN:", token);

        if (!token) {
          console.error("❌ No token found. Please login again.");
          return;
        }

        const res = await axios.get("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🔥 USER API RESPONSE:", res.data);

        // ✅ SET USER DATA
        setUsername(res.data.username);
        setUsertype(res.data.user_type);

      } catch (err) {
        console.error("❌ USER FETCH ERROR:", err);
      }
    };

    // ✅ FETCH PRODUCTS
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 PRODUCTS API RESPONSE:", res.data);

        // ✅ HANDLE MULTIPLE RESPONSE FORMATS
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (res.data && res.data.data) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
        }

      } catch (err) {
        console.error("❌ Product fetch error:", err);
        setProducts([]);
      }
    };

    // 🔥 CALL BOTH
    fetchUser();
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
        <strong>
          {username ? `${username} (${usertype})` : "Loading..."}
        </strong>
      </div>

      {/* 🔹 Products Section */}
      <div style={{ padding: "20px" }}>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              setUsertype={setUsertype} // 🔥 for dynamic update after subscribe
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