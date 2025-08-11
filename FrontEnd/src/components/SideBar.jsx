import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import commonStyles from "../styles/common.module.css";
import { useTheme } from "../hooks/useTheme.js";

export default function SideBar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dieticianName");
    navigate("/login");
  };

  return (
    <>
      <button
        className={styles.hamburgerButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brandSection}>
          <div className={styles.brandTitle}>Nutritionist</div>
          <div className={styles.brandSubtitle}>Management System</div>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/dashboard"
            className={`${styles.navItem} ${
              location.pathname === "/dashboard" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/clients"
            className={`${styles.navItem} ${
              location.pathname === "/clients" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Clients
          </Link>

          <div className={styles.buttonGroup}>
            <button onClick={toggleTheme} className={commonStyles.themeToggleButton}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
