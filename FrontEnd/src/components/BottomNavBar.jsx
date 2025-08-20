import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/BottomNavBar.module.css";
import {
  MdDashboard,
  MdEventNote,
  MdPeople,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { logoutUser } from "../services/auth";

export default function BottomNavBar() {
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logoutUser();
  };

  const navItems = [
    {
      type: "link",
      path: "/dashboard",
      icon: <MdDashboard size={24} />,
      label: t("sidebar.dashboard"),
    },
    {
      type: "link",
      path: "/appointments",
      icon: <MdEventNote size={24} />,
      label: t("sidebar.appointments"),
    },
    {
      type: "link",
      path: "/clients",
      icon: <MdPeople size={24} />,
      label: t("sidebar.clients"),
    },
    {
      type: "link",
      path: "/settings",
      icon: <MdSettings size={24} />,
      label: t("sidebar.settings"),
    },
    {
      type: "button",
      onClick: handleLogout,
      icon: <MdLogout size={24} />,
      label: t("sidebar.logout"),
      className: styles.logoutButton, // Add a specific class for styling
    },
  ];

  return (
    <nav className={styles.bottomNavBar}>
      {navItems.map((item, index) =>
        item.type === "link" ? (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
          >
            {item.icon}
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ) : (
          <button
            key={index} // Use index as key for buttons, or a unique ID if available
            onClick={item.onClick}
            className={`${styles.navItem} ${item.className || ""}`}
          >
            {item.icon}
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        )
      )}
    </nav>
  );
}
