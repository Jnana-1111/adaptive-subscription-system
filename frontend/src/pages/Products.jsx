import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data); // 👈 Debugging

        // ✅ FIX: products are inside data.data
        if (data && data.data) {
          setProducts(data.data);
        } else {
          setProducts([]); // fallback safety
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  }, []);

  return (
    <div className="grid">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <h2>No products available</h2>
      )}
    </div>
  );
}

export default Products;