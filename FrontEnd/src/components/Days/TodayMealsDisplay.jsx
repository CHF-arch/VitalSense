import React from "react";
import styles from "../../styles/TodayMealPage.module.css";
import MealCard from "./MealCard";

export default function TodayMealsDisplay({ sortedTodayMeals }) {
  return (
    <>
      {sortedTodayMeals.length > 0 ? (
        sortedTodayMeals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))
      ) : (
        <p>No meals scheduled for today.</p>
      )}
    </>
  );
}
