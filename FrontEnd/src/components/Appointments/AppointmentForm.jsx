// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/AppointmentForm.jsx
import React from "react";
import styles from "../../styles/AppointmentForm.module.css";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import { el } from "date-fns/locale/el";
import { enUS } from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("el", el);
registerLocale("en", enUS);

const AppointmentForm = ({ title, setTitle, start, setStart, end, setEnd }) => {
  const { t, i18n } = useTranslation();
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
          dateFormat="dd-MM-yyyy HH:mm"
          timeFormat="HH:mm"
          timeIntervals={10}
          timeCaption={t("appointments.time")}
          className={styles.textInput}
          locale={i18n.language}
          popperClassName={styles.datepickerPopper}
          required
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
          dateFormat="dd-MM-yyyy HH:mm"
          timeFormat="HH:mm"
          timeIntervals={10}
          timeCaption={t("appointments.time")}
          className={styles.textInput}
          locale={i18n.language}
          popperClassName={styles.datepickerPopper}
          required
        />
      </div>
    </>
  );
};

export default AppointmentForm;