import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import styles from "../styles/RootLayout.module.css";

const RootLayout = () => {
  return (
    <div className={styles.rootLayout}>
      <SideBar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
