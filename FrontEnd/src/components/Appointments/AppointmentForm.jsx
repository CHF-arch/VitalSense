// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/AppointmentForm.jsx
import React from "react";
import styles from "../../styles/AppointmentForm.module.css";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

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
        <DatePicker
          selected={start ? moment(start).toDate() : null}
          onChange={(date) => setStart(moment(date).format("YYYY-MM-DDTHH:mm"))}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption={t("appointments.time")}
          className={styles.textInput}
        />
      </div>
      <div className={styles.lastFormGroup}>
        <label htmlFor="end" className={styles.inputLabel}>
          {t("appointments.end")}:
        </label>
        <DatePicker
          selected={end ? moment(end).toDate() : null}
          onChange={(date) => setEnd(moment(date).format("YYYY-MM-DDTHH:mm"))}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption={t("appointments.time")}
          className={styles.textInput}
        />
      </div>
    </>
  );
};

export default AppointmentForm;
