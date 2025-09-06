import React from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal";
import clientsListStyles from "../../styles/ClientsList.module.css"; // Import ClientsList styles

export default function NewAppointmentButton({ onSuccess }) {
  const { t } = useTranslation();
  const { openNewAppointmentModal } = useModal();

  const handleOpenModal = () => {
    openNewAppointmentModal(onSuccess);
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
