import { Link, useLocation } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../services/auth";

export default function SideBar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logoutUser();
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
          <div className={styles.brandTitle}>Vital Sense</div>
          <div className={styles.brandSubtitle}>
            {t("sidebar.management_system")}
          </div>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/dashboard"
            className={`${styles.navItem} ${
              location.pathname === "/dashboard" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("sidebar.dashboard")}
          </Link>
          <Link
            to="/appointments"
            className={`${styles.navItem} ${
              location.pathname === "/appointments" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("sidebar.appointments")}
          </Link>
          <Link
            to="/clients"
            className={`${styles.navItem} ${
              location.pathname === "/clients" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("sidebar.clients")}
          </Link>
          <Link
            to="/settings"
            className={`${styles.navItem} ${
              location.pathname === "/settings" ? styles.active : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t("sidebar.settings")}
          </Link>
          <div className={styles.buttonGroup}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              {t("sidebar.logout")}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
