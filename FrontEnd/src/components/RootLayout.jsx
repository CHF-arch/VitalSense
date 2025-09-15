import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import BottomNavBar from "./BottomNavBar";
import AddQuickClient from "./AddQuickClient/AddQuickClient";
import CreateQuestionnaireTemplateModal from "./QuestionnaireTemplate/createQuestionnaireTemplateModal";
import NewAppointmentModal from "./Appointments/NewAppointmentModal";
import ConfirmationModal from "./common/ConfirmationModal"; // Import the new component
import { useModal } from "../context/useModal";
import styles from "../styles/RootLayout.module.css";

const RootLayout = () => {
  const location = useLocation();
  const isTodayMealsPage = location.pathname.startsWith("/today-meal/client/");
  const {
    isAddQuickClientModalOpen,
    closeAddQuickClientModal,
    isCreateQuestionnaireTemplateModalOpen,
    closeCreateQuestionnaireTemplateModal,
    onQuestionnaireCreated,
    isConfirmationModalOpen,
    closeConfirmationModal,
    confirmationModalProps,
    // Generic modal state and functions
    isGenericModalOpen,
    genericModalContent,
    closeModal, // This is the generic closeModal
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
