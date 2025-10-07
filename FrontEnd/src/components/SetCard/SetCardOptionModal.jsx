import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Modal.module.css";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa"; // Import FaTimes

const SetCardOptionModal = ({ client, closeModal }) => {
  console.log("SetCardOptionModal rendered");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePhoneClick = () => {
    navigate(`/set-card/${client.id}`);
    closeModal();
  };

  const handleComputerClick = () => {
    navigate(`/set-card-pc/${client.id}`);
    closeModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{t("set_card_option.title")}</h2>
        <p>{t("set_card_option.description")}</p>
        <div className={styles.buttonContainer}>
          <button onClick={handlePhoneClick} className={styles.modalButton}>
            {t("set_card_option.phone")}
          </button>
          <button
            onClick={handleComputerClick}
            className={styles.modalButton}
            // disabled={true} // Disable the button
          >
            {t("set_card_option.computer")}
          </button>
        </div>
        <button onClick={closeModal} className={styles.closeButton}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default SetCardOptionModal;
