import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    const username = localStorage.getItem("username");

    if (username) {
      localStorage.removeItem(`cart_${username}`); // ✅ clear user cart
    }

    localStorage.removeItem("token");
    localStorage.removeItem("username");

    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <h2>🛒 Smartkart</h2>

      <div>
        <Link to="/">Products</Link>{" | "}
        <Link to="/cart">Cart 🛒</Link>{" | "}
        

        {!token ? (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;