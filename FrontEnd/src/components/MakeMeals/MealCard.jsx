import React from "react";
import styles from "../../styles/MakeMeals.module.css";
import { useTranslation } from "react-i18next";

const MealCard = ({ meal, mealIndex, onMealChange, onDayToggle }) => {
  const { t } = useTranslation();
  const weekDayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return (
    <div key={meal.id} className={styles.mealCard}>
      <label htmlFor={`mealTitle-${mealIndex}`}>{t("make_meals.title")}</label>
      <input
        id={`mealTitle-${mealIndex}`}
        type="text"
        name="title"
        placeholder={t("make_meals.meal_title")}
        value={meal.title}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <label htmlFor={`mealTime-${mealIndex}`}>{t("make_meals.time")}</label>
      <input
        id={`mealTime-${mealIndex}`}
        type="time"
        name="time"
        value={meal.time}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <label htmlFor={`mealDescription-${mealIndex}`}>
        {t("make_meals.description")}
      </label>
      <textarea
        id={`mealDescription-${mealIndex}`}
        name="description"
        placeholder={t("make_meals.description")}
        value={meal.description}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <div className={styles.nutritionRow}>
        <div>
          <label htmlFor={`protein-${mealIndex}`}>
            {t("make_meals.protein")}
          </label>
          <input
            id={`protein-${mealIndex}`}
            type="number"
            name="protein"
            placeholder={t("make_meals.protein")}
            value={meal.protein}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`carbs-${mealIndex}`}>{t("make_meals.carbs")}</label>
          <input
            id={`carbs-${mealIndex}`}
            type="number"
            name="carbs"
            placeholder={t("make_meals.carbs")}
            value={meal.carbs}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`fats-${mealIndex}`}>{t("make_meals.fats")}</label>
          <input
            id={`fats-${mealIndex}`}
            type="number"
            name="fats"
            placeholder={t("make_meals.fats")}
            value={meal.fats}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`calories-${mealIndex}`}>
            {t("make_meals.calories")}
          </label>
          <input
            id={`calories-${mealIndex}`}
            type="number"
            name="calories"
            placeholder={t("make_meals.calories")}
            value={meal.calories}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
      </div>
      <div className={styles.daysSelection}>
        <p>{t("make_meals.select_days")}:</p>
        <div className={styles.checkboxGroup}>
          {weekDayKeys.map((dayKey) => (
            <label key={dayKey} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={meal.days.includes(dayKey)}
                onChange={() => onDayToggle(mealIndex, dayKey)}
              />
              {t(`days.${dayKey}`).substring(0, 3)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
