import React, { useState, useCallback } from "react";
import { createAppointment } from "../services/appointment";
import { getClientById } from "../services/client";
import ModalContext from "./ModalContextInstance";

export const ModalProvider = ({ children }) => {
  const [isAddQuickClientModalOpen, setIsAddQuickClientModalOpen] =
    useState(false);
  const [onClientAddedCallback, setOnClientAddedCallback] = useState(null);

  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [onAppointmentCreated, setOnAppointmentCreated] = useState(null);
  const [initialAppointmentData, setInitialAppointmentData] = useState(null);
  const [
    isCreateQuestionnaireTemplateModalOpen,
    setIsCreateQuestionnaireTemplateModalOpen,
  ] = useState(false);
  const [onQuestionnaireCreated, setOnQuestionnaireCreated] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalProps, setConfirmationModalProps] = useState(null);

  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [genericModalContent, setGenericModalContent] = useState(null);

  const openAddQuickClientModal = (callback) => {
    setOnClientAddedCallback(() => callback);
    setIsAddQuickClientModalOpen(true);
  };

  const closeAddQuickClientModal = () => {
    setIsAddQuickClientModalOpen(false);
    setOnClientAddedCallback(null);
  };

  const openNewAppointmentModal = (callback, initialData = null) => {
    setOnAppointmentCreated(() => callback);
    setInitialAppointmentData(initialData);
    setIsNewAppointmentModalOpen(true);
  };

  const closeNewAppointmentModal = () => {
    setIsNewAppointmentModalOpen(false);
    setOnAppointmentCreated(null);
    setInitialAppointmentData(null);
  };

  const openCreateQuestionnaireTemplateModal = (callback) => {
    setOnQuestionnaireCreated(() => callback);
    setIsCreateQuestionnaireTemplateModalOpen(true);
  };

  const closeCreateQuestionnaireTemplateModal = () => {
    setIsCreateQuestionnaireTemplateModalOpen(false);
    setOnQuestionnaireCreated(null);
  };

  const openConfirmationModal = (message, onConfirm) => {
    setConfirmationModalProps({ message, onConfirm });
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalProps(null);
    setIsConfirmationModalOpen(false);
  };

  const openModal = (content) => {
    console.log("openModal called with content:", content);
    setGenericModalContent(content);
    setIsGenericModalOpen(true);
  };

  const closeModal = () => {
    setGenericModalContent(null);
    setIsGenericModalOpen(false);
  };

  const handleNewAppointment = useCallback(
    async (appointmentData) => {
      try {
        const createdAppointment = await createAppointment(appointmentData);
        let clientDetails = null;

        if (createdAppointment.clientId) {
          try {
            clientDetails = await getClientById(createdAppointment.clientId);
          } catch (error) {
            console.error(
              `Error fetching client ${createdAppointment.clientId}:`,
              error
            );
          }
        }

        const fullAppointment = {
          ...createdAppointment,
          client: clientDetails,
        };

        if (onAppointmentCreated) {
          onAppointmentCreated(fullAppointment);
        }
        closeNewAppointmentModal();
      } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
      }
    },
    [onAppointmentCreated]
  );

  return (
    <ModalContext.Provider
      value={{
        isAddQuickClientModalOpen: isAddQuickClientModalOpen,
        openAddQuickClientModal: openAddQuickClientModal,
        closeAddQuickClientModal: closeAddQuickClientModal,
        onClientAddedCallback: onClientAddedCallback,
        isNewAppointmentModalOpen: isNewAppointmentModalOpen,
        openNewAppointmentModal: openNewAppointmentModal,
        closeNewAppointmentModal: closeNewAppointmentModal,
        handleNewAppointment: handleNewAppointment,
        initialAppointmentData: initialAppointmentData,
        isCreateQuestionnaireTemplateModalOpen: isCreateQuestionnaireTemplateModalOpen,
        openCreateQuestionnaireTemplateModal: openCreateQuestionnaireTemplateModal,
        closeCreateQuestionnaireTemplateModal: closeCreateQuestionnaireTemplateModal,
        onQuestionnaireCreated: onQuestionnaireCreated,
        isConfirmationModalOpen: isConfirmationModalOpen,
        openConfirmationModal: openConfirmationModal,
        closeConfirmationModal: closeConfirmationModal,
        confirmationModalProps: confirmationModalProps,
        openModal: openModal,
        closeModal: closeModal,
        isGenericModalOpen: isGenericModalOpen,
        genericModalContent: genericModalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
