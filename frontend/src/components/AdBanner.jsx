import React from "react";
import ad1 from "../assets/ad_banner.png";

const AdBanner = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "10px 0", // slightly reduced spacing
      }}
    >
      <img
        src={ad1}
        alt="Ad Banner"
        style={{
          width: "80%",        // 👈 reduced width
          maxWidth: "900px",   // 👈 smaller max width
          height: "100px",     // 👈 reduced height
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    </div>
  );
};

export default AdBanner;