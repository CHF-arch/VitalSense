import { Link, useLocation } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../services/auth";
import logo from "../images/VitalSense_Logo_tr.png";
import { useEffect } from "react";
import useAuthStore from "../context/authStore";
import {
  MdDashboard,
  MdEventNote,
  MdPeople,
  MdSettings,
  MdLogout,
  MdDescription,
} from "react-icons/md";

export default function SideBar({ isOpen, onClose }) {
  const location = useLocation();
  const { t } = useTranslation();
  const username = useAuthStore((state) => state.username);

  const handleLogout = () => {
    logoutUser();
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: <MdDashboard size={24} />,
      label: t("sidebar.dashboard"),
    },
    {
      path: "/appointments",
      icon: <MdEventNote size={24} />,
      label: t("sidebar.appointments"),
    },
    {
      path: "/clients-list",
      icon: <MdPeople size={24} />,
      label: t("sidebar.clients"),
    },
    {
      path: "/questionnaire-templates",
      icon: <MdDescription size={24} />,
      label: t("sidebar.questionnaire_templates"),
    },
    {
      path: "/settings",
      icon: <MdSettings size={24} />,
      label: t("sidebar.settings"),
    },
  ];

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.isOpen : ""}`}>
        <div className={styles.brandSection}>
          <img src={logo} alt="" className={styles.logo} />
          <div className={styles.brandTitle}>Vital Sense</div>
          <div className={styles.brandSubtitle}>
            {t("sidebar.management_system")}
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ""
              }`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.buttonGroup}>
          <div className={styles.dieticianNameBox}>{username}</div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <MdLogout size={24} />
            <span>{t("sidebar.logout")}</span>
          </button>
          <Link
            to="/privacy-policy"
            className={styles.miniLink}
            onClick={onClose}
          >
            {t("sidebar.privacy_policy")}
          </Link>
        </div>
      </div>
      {isOpen && <div className={styles.backdrop} onClick={onClose}></div>}
    </>
  );
}
