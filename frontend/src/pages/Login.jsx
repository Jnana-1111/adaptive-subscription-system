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

      // ✅ Extract data from backend
      const token = res.data.data.access_token;
      const user = res.data.data.user;

      // ✅ Store in localStorage (backend-driven)
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("usertype", user.user_type);

      alert("Login successful!");

      // ✅ Redirect to products page
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
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;