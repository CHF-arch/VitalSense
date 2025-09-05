import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isAddQuickClientModalOpen, setIsAddQuickClientModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

  const openAddQuickClientModal = () => setIsAddQuickClientModalOpen(true);
  const closeAddQuickClientModal = () => setIsAddQuickClientModalOpen(false);

  const openNewAppointmentModal = () => setIsNewAppointmentModalOpen(true);
  const closeNewAppointmentModal = () => setIsNewAppointmentModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isAddQuickClientModalOpen,
        openAddQuickClientModal,
        closeAddQuickClientModal,
        isNewAppointmentModalOpen,
        openNewAppointmentModal,
        closeNewAppointmentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);