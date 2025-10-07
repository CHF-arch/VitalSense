import React from "react";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal"; // Import useModal

export default function AddQuickClientButton({ onClientAdded }) {
  const { t } = useTranslation();
  const { openAddQuickClientModal } = useModal(); // Use the modal context

  const handleOpenModal = () => {
    openAddQuickClientModal(onClientAdded); // Open the global modal
  };

  return (
    <div className={styles.addQuickClientContainer}>
      <button onClick={handleOpenModal} className={styles.button}>
        {t("clientlist.add_quick_client")}
      </button>
    </div>
  );
}
