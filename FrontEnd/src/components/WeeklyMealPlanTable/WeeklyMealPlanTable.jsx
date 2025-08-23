import React from "react";
import styles from "../../styles/WeeklyMealPlanTable.module.css";
import MealCard from "../Days/MealCard";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx"; // Added XLSX import

export default function WeeklyMealPlanTable({ mealPlan }) {
  const { t } = useTranslation();
  const weekDays = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
    t("days.sunday"),
  ];

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    const header = ["Time", "Meal", ...weekDays];
    wsData.push(header);

    // Flatten all meals from all days into a single array for easier processing
    const allMeals = mealPlan.days.flatMap((day) =>
      day.meals.map((meal) => ({ ...meal, originalDay: day.title }))
    );

    // Create a composite key for grouping: `time-title`
    const groupedMeals = allMeals.reduce((acc, meal) => {
      const key = `${meal.time}-${meal.title.trim()}`;
      if (!acc[key]) {
        acc[key] = {
          time: meal.time,
          title: meal.title.trim(), // Trim title here for consistency
          days: {},
        };
      }
      const dayKey = getDayKey(meal.originalDay); // Get the English key (e.g., "monday")

      if (!acc[key].days[dayKey]) { // Use the English key as the internal identifier
        acc[key].days[dayKey] = [];
      }
      acc[key].days[dayKey].push(meal.description);
      return acc;
    }, {});

    // Sort the keys to ensure consistent row order (e.g., by time, then by meal title)
    const sortedKeys = Object.keys(groupedMeals).sort((a, b) => {
      const [timeA, titleA] = a.split("-");
      const [timeB, titleB] = b.split("-");
      if (timeA !== timeB) {
        return timeA.localeCompare(timeB);
      }
      return titleA.localeCompare(titleB);
    });

    for (const key of sortedKeys) {
      const mealGroup = groupedMeals[key];
      const row = [mealGroup.time, mealGroup.title];

      weekDays.forEach((day) => {
        const currentDayKey = getDayKey(day);
        if (mealGroup.days[currentDayKey]) {
          row.push(mealGroup.days[currentDayKey].join(", "));
        } else {
          row.push("");
        }
      });
      wsData.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Meal Plan");
    const fileName = mealPlan.title
      ? `${mealPlan.title}.xlsx`
      : "MealPlan.xlsx";
    XLSX.writeFile(wb, fileName);
  };

  if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
    return (
      <p className={styles.noMeals}>No meal days found for this meal plan.</p>
    );
  }

  const dayTranslationKeyMap = {
    "Δευτέρα": "monday",
    "Τρίτη": "tuesday",
    "Τετάρτη": "wednesday",
    "Πέμπτη": "thursday",
    "Παρασκευή": "friday",
    "Σάββατο": "saturday",
    "Κυριακή": "sunday",
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
    Sunday: "sunday",
  };

  const getDayKey = (dayTitle) =>
    dayTranslationKeyMap[dayTitle] || dayTitle.toLowerCase();

  // Sort days based on a consistent order
  const sortedDays = [...mealPlan.days].sort((a, b) => {
    const daysOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayA = getDayKey(a.title);
    const dayB = getDayKey(b.title);
    return daysOrder.indexOf(dayA) - daysOrder.indexOf(dayB);
  });

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleExportToExcel} className={styles.exportButton}>
        {t("weekly_meal_plan_table.export_to_excel")}
      </button>
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
              <td className={styles.dayTitle}>
                {t(`days.${getDayKey(day.title)}`)}
              </td>
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
