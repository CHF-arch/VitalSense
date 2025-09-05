import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import BottomNavBar from "./BottomNavBar";
import AddQuickClient from "./AddQuickClient/AddQuickClient";
import NewAppointmentModal from "./Appointments/NewAppointmentModal"; // Import NewAppointmentModal
import { useModal } from "../context/ModalContext";
import styles from "../styles/RootLayout.module.css";

const RootLayout = () => {
  const location = useLocation();
  const isTodayMealsPage = location.pathname.startsWith("/today-meal/client/");
  const {
    isAddQuickClientModalOpen,
    closeAddQuickClientModal,
    isNewAppointmentModalOpen,
    closeNewAppointmentModal,
  } = useModal();

  return (
    <div className={styles.rootLayout}>
      {!isTodayMealsPage && <SideBar />}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      {!isTodayMealsPage && <BottomNavBar />}
      <AddQuickClient
        isOpen={isAddQuickClientModalOpen}
        onClose={closeAddQuickClientModal}
      />
      <NewAppointmentModal // Render the new appointment modal
        isOpen={isNewAppointmentModalOpen}
        onClose={closeNewAppointmentModal}
      />
    </div>
  );
};

export default RootLayout;