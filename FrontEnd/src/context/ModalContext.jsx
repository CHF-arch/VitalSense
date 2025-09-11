import React, { useState, useCallback } from "react";
import { createAppointment } from "../services/appointment";
import { getClientById } from "../services/client";
import ModalContext from "./ModalContextInstance";

export const ModalProvider = ({ children }) => {
  const [isAddQuickClientModalOpen, setIsAddQuickClientModalOpen] =
    useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [onAppointmentCreated, setOnAppointmentCreated] = useState(null);
  const [
    isCreateQuestionnaireTemplateModalOpen,
    setIsCreateQuestionnaireTemplateModalOpen,
  ] = useState(false);
  const [onQuestionnaireCreated, setOnQuestionnaireCreated] = useState(null);

  const openAddQuickClientModal = () => setIsAddQuickClientModalOpen(true);
  const closeAddQuickClientModal = () => setIsAddQuickClientModalOpen(false);

  const openNewAppointmentModal = (callback) => {
    setOnAppointmentCreated(() => callback);
    setIsNewAppointmentModalOpen(true);
  };

  const closeNewAppointmentModal = () => {
    setIsNewAppointmentModalOpen(false);
    setOnAppointmentCreated(null);
  };

  const openCreateQuestionnaireTemplateModal = (callback) => {
    setOnQuestionnaireCreated(() => callback);
    setIsCreateQuestionnaireTemplateModalOpen(true);
  };

  const closeCreateQuestionnaireTemplateModal = () => {
    setIsCreateQuestionnaireTemplateModalOpen(false);
    setOnQuestionnaireCreated(null);
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
        isAddQuickClientModalOpen,
        openAddQuickClientModal,
        closeAddQuickClientModal,
        isNewAppointmentModalOpen,
        openNewAppointmentModal,
        closeNewAppointmentModal,
        handleNewAppointment,
        isCreateQuestionnaireTemplateModalOpen,
        openCreateQuestionnaireTemplateModal,
        closeCreateQuestionnaireTemplateModal,
        onQuestionnaireCreated,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
