// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/AppointmentForm.jsx
import React from "react";
import styles from "../../styles/AppointmentForm.module.css";
import { useTranslation } from "react-i18next";

const AppointmentForm = ({ title, setTitle, start, setStart, end, setEnd }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.inputLabel}>
          {t("appointments.title")}:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.textInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="start" className={styles.inputLabel}>
          {t("appointments.start")}:
        </label>
        <input
          type="datetime-local"
          id="start"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={styles.textInput}
        />
      </div>
      <div className={styles.lastFormGroup}>
        <label htmlFor="end" className={styles.inputLabel}>
          {t("appointments.end")}:
        </label>
        <input
          type="datetime-local"
          id="end"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={styles.textInput}
        />
      </div>
    </>
  );
};

export default AppointmentForm;
