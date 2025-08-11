import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMealPlanData } from "../../hooks/useMealPlanData";
import TodayMealsDisplay from "./TodayMealsDisplay";
import FullWeekMealsDisplay from "./FullWeekMealsDisplay";
import styles from "../../styles/TodayMealPage.module.css";
import { useTheme } from "../../hooks/useTheme";
// import commonStyles from "../../styles/common.module.css";

export default function Days() {
  const { clientId } = useParams();
  const { mealPlan, loading, error } = useMealPlanData(clientId);
  const [showFullWeek, setShowFullWeek] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error.message}</div>;
  }

  // Sorting logic for today's meals
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayMeals =
    mealPlan?.days?.find((day) => day.title === today)?.meals || [];
  const sortedTodayMeals = [...todayMeals].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  // Sorting logic for weekly view
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortedDays = mealPlan?.days
    ? [...mealPlan.days]
        .sort((a, b) => dayOrder.indexOf(a.title) - dayOrder.indexOf(b.title))
        .map((day) => ({
          ...day,
          meals: [...day.meals].sort((a, b) => a.time.localeCompare(b.time)),
        }))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>
          {showFullWeek ? "Full Week Meal Plan" : "Today's Meals"}
        </h1>
        <div className={styles.buttonGroupColumn}>
          <button
            onClick={() => setShowFullWeek(!showFullWeek)}
            className={styles.toggleButton}
          >
            {showFullWeek ? "Show Today" : "Show Full Week"}
          </button>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      {showFullWeek ? (
        <FullWeekMealsDisplay sortedDays={sortedDays} />
      ) : (
        <TodayMealsDisplay sortedTodayMeals={sortedTodayMeals} />
      )}
    </div>
  );
}
