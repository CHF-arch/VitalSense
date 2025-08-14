import React from "react";
import styles from "../../styles/WeeklyMealPlanTable.module.css";
import MealCard from "../Days/MealCard";
import { useTranslation } from "react-i18next";

export default function WeeklyMealPlanTable({ mealPlan }) {
  const { t } = useTranslation();
  if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
    return (
      <p className={styles.noMeals}>No meal days found for this meal plan.</p>
    );
  }

  // Sort days by their title (assuming titles are like "Monday", "Tuesday", etc.)
  // A more robust solution would involve a predefined order or a 'dayOfWeek' property
  const sortedDays = [...mealPlan.days].sort((a, b) => {
    const daysOrder = [
      t("weekly_meal_plan_table.monday"),
      t("weekly_meal_plan_table.tuesday"),
      t("weekly_meal_plan_table.wednesday"),
      t("weekly_meal_plan_table.thursday"),
      t("weekly_meal_plan_table.friday"),
      t("weekly_meal_plan_table.saturday"),
      t("weekly_meal_plan_table.sunday"),
    ];
    return daysOrder.indexOf(a.title) - daysOrder.indexOf(b.title);
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.mealTable}>
        <thead>
          <tr>
            <th>{t("weekly_meal_plan_table.day")}</th>
            <th>{t("weekly_meal_plan_table.meals")}</th>
          </tr>
        </thead>
        <tbody>
          {sortedDays.map((day) => (
            <tr key={day.id}>
              <td className={styles.dayTitle}>{day.title}</td>
              <td>
                {day.meals && day.meals.length > 0 ? (
                  <div className={styles.mealCardsContainer}>
                    {/* Sort meals by time */}
                    {day.meals
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((meal, index) => (
                        <MealCard key={index} meal={meal} />
                      ))}
                  </div>
                ) : (
                  <p className={styles.noMealsForDay}>
                    {t("weekly_meal_plan_table.no_meals")}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
