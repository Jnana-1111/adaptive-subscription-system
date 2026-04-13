import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [username, setUsername] = useState("");
  const [usertype, setUsertype] = useState("");
  const [discount, setDiscount] = useState(null);

  // 🔥 NEW STATES
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("✅ Products component mounted");

    // ✅ FETCH USER
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.username);
        setUsertype(res.data.user_type);

        // ✅ FETCH DISCOUNT
        const discountRes = await axios.get(
          `http://localhost:5000/discount-by-user?usertype=${res.data.user_type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDiscount(discountRes.data.discount_percent);

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

        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && res.data.data) {
          data = res.data.data;
        }

        setProducts(data);
        setFilteredProducts(data);

      } catch (err) {
        console.error("❌ Product fetch error:", err);
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchUser();
    fetchProducts();
  }, []);

  // 🔥 SEARCH + FILTER + SORT
  useEffect(() => {
    let updated = [...products];

    // 🔍 SEARCH
    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🔍 FILTER
    if (priceFilter === "low") {
      updated = updated.filter((p) => p.price < 500);
    } else if (priceFilter === "medium") {
      updated = updated.filter((p) => p.price >= 500 && p.price <= 1000);
    } else if (priceFilter === "high") {
      updated = updated.filter((p) => p.price > 1000);
    }

    // 🔽 SORT
    if (sortOption === "low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(updated);
  }, [searchTerm, priceFilter, sortOption, products]);

  return (
    <div>

      {/* 🔹 USER INFO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {username && (
          <strong>
            {username} ({usertype})
          </strong>
        )}

        {discount !== null && (
          <span style={{ color: "green", fontSize: "14px" }}>
            🎉 {usertype} users get {discount}% discount
          </span>
        )}
      </div>

      {/* 🔥 CENTERED SEARCH + FILTER + SORT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
          backgroundColor: "#f5f5f5",
        }}
      >

        {/* SEARCH BAR CENTER */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "50%",
            maxWidth: "500px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            outline: "none",
            textAlign: "center",
            fontSize: "16px",
          }}
        />

        {/* FILTER + SORT */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >

          {/* FILTER */}
          <select onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="low">Below ₹500</option>
            <option value="medium">₹500 - ₹1000</option>
            <option value="high">Above ₹1000</option>
          </select>

          {/* SORT */}
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort By</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
            <option value="name">Name A → Z</option>
          </select>

        </div>
      </div>

      {/* 🔹 PRODUCTS GRID */}
      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              setUsertype={setUsertype}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default Products;