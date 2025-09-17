import React, { useState } from "react";
import { useModal } from "../../context/useModal";
import { changeEmail } from "../../services/auth";
import { toast } from "react-toastify";
import styles from "../../styles/ChangeModals.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function EmailChangeModal() {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeEmail(newEmail, currentPassword);
      toast.success(t("settings.email_changed_successfully"));
      closeModal();
    } catch (error) {
      toast.error(error.message || t("settings.email_change_failed"));
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t("settings.change_email")}</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label htmlFor="newEmail">{t("settings.new_email")}</label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">
            {t("settings.current_password")}
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showCurrentPassword ? faEye : faEyeSlash}
              className={styles.passwordToggleIcon}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={closeModal}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.saveButton}`}
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
