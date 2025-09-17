import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../context/useModal";
import { changePassword, logoutUser } from "../../services/auth";
import { toast } from "react-toastify";
import styles from "../../styles/ChangeModals.module.css";
import { useTranslation } from "react-i18next";
import LoginRequerments from "../Login/LoginRequerments.jsx";

export default function PasswordChangeModal() {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error(t("settings.passwords_do_not_match"));
      return;
    }
    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      toast.success(t("settings.password_changed_successfully"));
      closeModal();
      logoutUser();
    } catch (error) {
      toast.error(error.message || t("settings.password_change_failed"));
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t("settings.change_password")}</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.modalBody}>
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
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">{t("settings.new_password")}</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showNewPassword ? faEye : faEyeSlash}
              className={styles.passwordToggleIcon}
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmNewPassword">
            {t("settings.confirm_new_password")}
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showConfirmNewPassword ? faEye : faEyeSlash}
              className={styles.passwordToggleIcon}
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
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
        <LoginRequerments password={newPassword} />
      </form>
    </div>
  );
}
