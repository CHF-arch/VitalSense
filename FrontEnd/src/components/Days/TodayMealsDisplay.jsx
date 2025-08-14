import React from "react";
import styles from "../../styles/TodayMealPage.module.css";
import MealCard from "./MealCard";
import { useTranslation } from "react-i18next";

export default function TodayMealsDisplay({ sortedTodayMeals }) {
  const { t } = useTranslation();
  return (
    <>
      {sortedTodayMeals.length > 0 ? (
        sortedTodayMeals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))
      ) : (
        <p>{t("days.no_meals")}</p>
      )}
    </>
  );
}
