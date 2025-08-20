import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import BottomNavBar from "./BottomNavBar";
import styles from "../styles/RootLayout.module.css";

const RootLayout = () => {
  const location = useLocation();
  const isTodayMealsPage = location.pathname.startsWith("/today-meal/client/");

  return (
    <div className={styles.rootLayout}>
      {!isTodayMealsPage && <SideBar />}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      {!isTodayMealsPage && <BottomNavBar />}
    </div>
  );
};

export default RootLayout;
