import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <h2>Subscription Manager</h2>

      <div>
        <Link to="/">Products</Link>{" | "}

        {!token ? (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;