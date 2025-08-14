import { useTranslation } from "react-i18next";
import React from "react";
import styles from "../../styles/AddClientForm.module.css";

const AddClientForm = ({
  newClientFirstName,
  setNewClientFirstName,
  newClientLastName,
  setNewClientLastName,
  newClientEmail,
  setNewClientEmail,
  newClientPhoneNumber,
  setNewClientPhoneNumber,
  newClientDateOfBirth,
  setNewClientDateOfBirth,
  newClientGender,
  setNewClientGender,
  newClientHasCard,
  setNewClientHasCard,
  newClientNotes,
  setNewClientNotes,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className={styles.newClientDetailsTitle}>
        {t("appointments.new_client_details")}
      </h3>
      <div className={styles.formGroup}>
        <label htmlFor="newClientFirstName" className={styles.inputLabel}>
          {t("appointments.first_name")}:
        </label>
        <input
          type="text"
          id="newClientFirstName"
          value={newClientFirstName}
          onChange={(e) => setNewClientFirstName(e.target.value)}
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientLastName" className={styles.inputLabel}>
          {t("appointments.last_name")}:
        </label>
        <input
          type="text"
          id="newClientLastName"
          value={newClientLastName}
          onChange={(e) => setNewClientLastName(e.target.value)}
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientPhoneNumber" className={styles.inputLabel}>
          {t("appointments.phone_number")}:
        </label>
        <input
          type="text"
          id="newClientPhoneNumber"
          value={newClientPhoneNumber}
          onChange={(e) => setNewClientPhoneNumber(e.target.value)}
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientEmail" className={styles.inputLabel}>
          {t("appointments.email")}:
        </label>
        <input
          type="email"
          id="newClientEmail"
          value={newClientEmail}
          onChange={(e) => setNewClientEmail(e.target.value)}
          className={styles.textInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientDateOfBirth" className={styles.inputLabel}>
          {t("appointments.date_of_birth")}:
        </label>
        <input
          type="date"
          n
          id="newClientDateOfBirth"
          value={newClientDateOfBirth || ""}
          onChange={(e) => setNewClientDateOfBirth(e.target.value)}
          className={styles.textInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientGender" className={styles.inputLabel}>
          {t("appointments.gender")}:
        </label>
        <select
          id="newClientGender"
          value={newClientGender}
          onChange={(e) => setNewClientGender(e.target.value)}
          className={styles.textInput}
        >
          <option value="">{t("appointments.select_gender")}</option>
          <option value="male">{t("appointments.male")}</option>
          <option value="female">{t("appointments.female")}</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientHasCard" className={styles.inputLabel}>
          <input
            type="checkbox"
            id="newClientHasCard"
            checked={newClientHasCard}
            onChange={(e) => setNewClientHasCard(e.target.checked)}
            className={styles.checkboxInput}
          />
          {t("appointments.has_card")}
        </label>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="newClientNotes" className={styles.inputLabel}>
          {t("appointments.notes")}
        </label>
        <textarea
          id="newClientNotes"
          value={newClientNotes}
          onChange={(e) => setNewClientNotes(e.target.value)}
          className={styles.textareaInput}
          rows="3"
        />
      </div>
    </div>
  );
};

export default AddClientForm;
