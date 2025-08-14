import React from "react";
import styles from "../../styles/TodayMealPage.module.css";
import { useTranslation } from "react-i18next";

const MealCard = ({ meal }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.mealCard}>
      <h2 className={styles.mealTitle}>{meal.title}</h2>
      <p className={styles.mealTime}>
        {t("days.time")}: {meal.time}
      </p>
      <p className={styles.mealDescription}>{meal.description}</p>
      <div className={styles.nutritionInfo}>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionLabel}>{t("days.protein")}:</span>{" "}
          {meal.protein}
          {t("days.grams")}
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionLabel}>{t("days.carbs")}:</span>{" "}
          {meal.carbs}
          {t("days.grams")}
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionLabel}>{t("days.fat")}:</span>{" "}
          {meal.fats}
          {t("days.grams")}
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionLabel}>{t("days.calories")}:</span>{" "}
          {meal.calories}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
