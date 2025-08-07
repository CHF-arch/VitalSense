import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/SideBar.module.css";

export default function SideBar() {
  const navigate = useNavigate();
  const dieticianName = localStorage.getItem("dieticianName") || "Dietician";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dieticianName");
    navigate("/login");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.dieticianNameBox}>
        <span className={styles.dieticianName}>{dieticianName}</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.navItem}>
          Dashboard
        </Link>
        <Link to="/clients" className={styles.navItem}>
          Clients
        </Link>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </nav>
    </div>
  );
}
