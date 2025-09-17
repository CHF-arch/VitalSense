import React, { useState } from "react";
import { useModal } from "../../context/useModal";
import { changeUsername, logoutUser } from "../../services/auth";
import { toast } from "react-toastify";
import styles from "../../styles/ChangeModals.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function UsernameChangeModal() {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeUsername(newUsername, currentPassword);
      toast.success(t("settings.username_changed_successfully"));
      closeModal();
      logoutUser();
    } catch (error) {
      toast.error(error.message || t("settings.username_change_failed"));
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t("settings.change_username")}</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label htmlFor="newUsername">{t("settings.new_username")}</label>
          <input
            type="text"
            id="newUsername"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
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
