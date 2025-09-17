import { Link, useLocation } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../services/auth";
import logo from "../images/VitalSense_Logo_tr.png";
import { useEffect, useState } from "react";

export default function SideBar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.brandSection}>
        <img src={logo} alt="" className={styles.logo} />
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
        >
          {t("sidebar.dashboard")}
        </Link>
        <Link
          to="/appointments"
          className={`${styles.navItem} ${
            location.pathname === "/appointments" ? styles.active : ""
          }`}
        >
          {t("sidebar.appointments")}
        </Link>
        <Link
          to="/clients"
          className={`${styles.navItem} ${
            location.pathname === "/clients" ? styles.active : ""
          }`}
        >
          {t("sidebar.clients")}
        </Link>
        <Link
          to="/questionnaire-templates"
          className={`${styles.navItem} ${
            location.pathname === "/questionnaire-templates"
              ? styles.active
              : ""
          }`}
        >
          {t("sidebar.questionnaire_templates")}
        </Link>
        <Link
          to="/settings"
          className={`${styles.navItem} ${
            location.pathname === "/settings" ? styles.active : ""
          }`}
        >
          {t("sidebar.settings")}
        </Link>

        <div className={styles.buttonGroup}>
          <div className={styles.dieticianNameBox}>
            <p>
              {t("sidebar.welcome")}, {username}
            </p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            {t("sidebar.logout")}
          </button>
          <Link to="/privacy-policy" className={styles.miniLink}>
            {t("sidebar.privacy_policy")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
