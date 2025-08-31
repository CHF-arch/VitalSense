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
          maxLength="15"
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
    </div>
  );
};

export default AddClientForm;
