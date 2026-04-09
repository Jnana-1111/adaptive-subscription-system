import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useCart } from "../context/CartContext"; // ✅ USE CONTEXT

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ REAL DATA FROM CONTEXT
  const { cart, wishlist } = useCart();

  const handleLogout = () => {
    const username = localStorage.getItem("username");

    if (username) {
      localStorage.removeItem(`cart_${username}`);
      localStorage.removeItem(`wishlist_${username}`);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        🛒 Smartkart
      </h2>

      <div style={styles.right}>
        <Link to="/">Products</Link>

        {/* ❤️ Wishlist */}
        <Link to="/wishlist" style={styles.icon}>
          <AiOutlineHeart />
          {wishlist.length > 0 && (
            <span style={styles.badge}>
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* 🛒 Cart */}
        <Link to="/cart" style={styles.icon}>
          <AiOutlineShoppingCart />
          {cart.length > 0 && (
            <span style={styles.badge}>
              {cart.length}
            </span>
          )}
        </Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#131921",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  right: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  icon: {
    position: "relative",
    fontSize: "24px",
    color: "white",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
};

export default Navbar;