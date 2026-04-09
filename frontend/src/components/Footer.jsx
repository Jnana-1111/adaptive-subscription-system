import React, { useState, useEffect } from "react";

const Footer = () => {
  // Online ad URLs (replace with real ad links if available)
  const ads = [
    "https://via.placeholder.com/800x150?text=Ad+1",
    "https://via.placeholder.com/800x150?text=Ad+2",
    "https://via.placeholder.com/800x150?text=Ad+3",
    "https://via.placeholder.com/800x150?text=Ad+4"
  ];

  const [currentAd, setCurrentAd] = useState(0);

  // Auto-rotate ads every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 3000); // change interval as needed
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <footer style={{
      marginTop: "40px",
      background: "#232f3e",
      color: "#fff",
      padding: "20px 0",
      textAlign: "center",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <img
          src={ads[currentAd]}
          alt={`Ad ${currentAd + 1}`}
          style={{
            width: "80%",
            maxWidth: "800px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>
      <p style={{ margin: 0 }}>© 2026 Smartkart. All rights reserved.</p>
    </footer>
  );
};

export default Footer;