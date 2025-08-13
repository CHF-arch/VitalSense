import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import styles from "../styles/RootLayout.module.css";
// import commonStyles from "../styles/common.module.css";
import { useTheme } from "../hooks/useTheme";

const RootLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isTodayMealsPage = location.pathname.startsWith("/today-meal/client/");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.rootLayout}>
      {!isTodayMealsPage && (
        <SideBar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      )}
      <main className={styles.mainContent}>
        {isSidebarOpen && !isTodayMealsPage && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
