import React from "react";
import styles from "../../styles/MakeMeals.module.css";
import { t } from "i18next";

const PlanDetails = ({
  planTitle,
  setPlanTitle,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className={styles.planDetails}>
      <label htmlFor="planTitle">{t("make_meals.plan_title")}</label>
      <input
        id="planTitle"
        type="text"
        placeholder={t("make_meals.plan_title")}
        value={planTitle}
        onChange={(e) => setPlanTitle(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="startDate">{t("make_meals.start_date")}</label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="endDate">{t("make_meals.end_date")}</label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        className={styles.input}
      />
    </div>
  );
};

export default PlanDetails;
