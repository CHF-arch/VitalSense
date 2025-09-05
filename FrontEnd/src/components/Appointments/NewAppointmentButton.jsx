import React from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/ModalContext";
import clientsListStyles from "../../styles/ClientsList.module.css"; // Import ClientsList styles

export default function NewAppointmentButton() {
  const { t } = useTranslation();
  const { openNewAppointmentModal } = useModal();

  const handleOpenModal = () => {
    openNewAppointmentModal();
  };

  return (
    <div className={clientsListStyles.addQuickClientContainer}>
      {" "}
      {/* Reusing this container style for consistency */}
      <button onClick={handleOpenModal} className={clientsListStyles.button}>
        {t("appointments.new_appointment")}
      </button>
    </div>
  );
}
