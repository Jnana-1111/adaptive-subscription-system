import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.access_token;
      const user = res.data.user;

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ FIX: use email (or name)
      const username = user?.email;   // 🔥 IMPORTANT FIX

      if (!username) {
        throw new Error("Username missing from response");
      }

      localStorage.setItem("username", username);

      // ✅ Save usertype (already correct)
      localStorage.setItem("usertype", user.user_type);

      console.log("✅ Stored username:", username);

      alert("Login successful!");
      navigate("/products");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        alert(error.response.data.message || "Login failed");
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="center-container">
      <div className="form-box">
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;