import React from "react";
import styles from "../../styles/ConfirmationModal.module.css";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {t("common.confirm")}
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;