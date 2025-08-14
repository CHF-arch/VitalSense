import React from "react";
import styles from "../../styles/TodayMealPage.module.css";
import MealCard from "./MealCard";
import { useTranslation } from "react-i18next";

export default function FullWeekMealsDisplay({ sortedDays }) {
  const { t } = useTranslation();
  return (
    <>
      {sortedDays.map((day) => (
        <div key={day.id} className={styles.daySection}>
          <h2 className={styles.dayTitle}>{day.title}</h2>
          {day.meals.length > 0 ? (
            day.meals.map((meal, index) => <MealCard key={index} meal={meal} />)
          ) : (
            <p>{t("days.no_meals")}</p>
          )}
        </div>
      ))}
    </>
  );
}
