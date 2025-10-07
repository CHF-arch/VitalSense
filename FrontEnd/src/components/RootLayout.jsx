import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import MobileNavBar from "./MobileNavBar";
import AddQuickClient from "./AddQuickClient/AddQuickClient";
import CreateQuestionnaireTemplateModal from "./QuestionnaireTemplate/createQuestionnaireTemplateModal";
import NewAppointmentModal from "./Appointments/NewAppointmentModal";
import ConfirmationModal from "./common/ConfirmationModal";
import { useModal } from "../context/useModal";
import styles from "../styles/RootLayout.module.css";

const RootLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isTodayMealsPage = location.pathname.startsWith("/today-meal/client/");

  const {
    isAddQuickClientModalOpen,
    closeAddQuickClientModal,
    onClientAddedCallback,
    isCreateQuestionnaireTemplateModalOpen,
    closeCreateQuestionnaireTemplateModal,
    onQuestionnaireCreated,
    isConfirmationModalOpen,
    closeConfirmationModal,
    confirmationModalProps,
    isGenericModalOpen,
    genericModalContent,
    closeModal,
  } = useModal();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.rootLayout}>
      {!isTodayMealsPage && (
        <>
          <div className={styles.desktopSidebar}>
            <SideBar />
          </div>
          <div className={styles.mobileSidebar}>
            <MobileNavBar onMenuClick={toggleSidebar} />
            <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          </div>
        </>
      )}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <AddQuickClient
        isOpen={isAddQuickClientModalOpen}
        onClose={closeAddQuickClientModal}
        onClientAdded={onClientAddedCallback}
      />
      <NewAppointmentModal />
      {isCreateQuestionnaireTemplateModalOpen && (
        <CreateQuestionnaireTemplateModal
          closeModal={closeCreateQuestionnaireTemplateModal}
          onSuccess={onQuestionnaireCreated}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message={confirmationModalProps.message}
          onConfirm={() => {
            confirmationModalProps.onConfirm();
            closeConfirmationModal();
          }}
          onCancel={closeConfirmationModal}
        />
      )}
      {isGenericModalOpen &&
        React.cloneElement(genericModalContent, { closeModal })}
    </div>
  );
};

export default RootLayout;
