import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import { useTheme } from "../context/ThemeContext";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dieticianName = localStorage.getItem("dieticianName") || "Dietician";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dieticianName");
    navigate("/login");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.brandSection}>
        <div className={styles.brandTitle}>NutriCare</div>
        <div className={styles.brandSubtitle}>Management System</div>
      </div>

      <nav className={styles.nav}>
        <Link
          to="/dashboard"
          className={`${styles.navItem} ${
            location.pathname === "/dashboard" ? styles.active : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/clients"
          className={`${styles.navItem} ${
            location.pathname === "/clients" ? styles.active : ""
          }`}
        >
          Clients
        </Link>

        <div className={styles.buttonGroup}>
          <button onClick={toggleTheme} className={styles.themeToggleButton}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
