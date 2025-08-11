import React from "react";
import styles from "../../styles/TodayMealPage.module.css";

const MealCard = ({ meal }) => (
  <div className={styles.mealCard}>
    <h2 className={styles.mealTitle}>{meal.title}</h2>
    <p className={styles.mealTime}>Time: {meal.time}</p>
    <p className={styles.mealDescription}>{meal.description}</p>
    <div className={styles.nutritionInfo}>
      <div className={styles.nutritionItem}>
        <span className={styles.nutritionLabel}>Protein:</span> {meal.protein}g
      </div>
      <div className={styles.nutritionItem}>
        <span className={styles.nutritionLabel}>Carbs:</span> {meal.carbs}g
      </div>
      <div className={styles.nutritionItem}>
        <span className={styles.nutritionLabel}>Fats:</span> {meal.fats}g
      </div>
      <div className={styles.nutritionItem}>
        <span className={styles.nutritionLabel}>Calories:</span> {meal.calories}
      </div>
    </div>
  </div>
);

export default MealCard;
