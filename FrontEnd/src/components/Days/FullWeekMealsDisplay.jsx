import React from "react";
import styles from "../../styles/TodayMealPage.module.css";
import MealCard from "./MealCard";

export default function FullWeekMealsDisplay({ sortedDays }) {
  return (
    <>
      {sortedDays.map((day) => (
        <div key={day.id} className={styles.daySection}>
          <h2 className={styles.dayTitle}>{day.title}</h2>
          {day.meals.length > 0 ? (
            day.meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))
          ) : (
            <p>No meals scheduled for this day.</p>
          )}
        </div>
      ))}
    </>
  );
}
