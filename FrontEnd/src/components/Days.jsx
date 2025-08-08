import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTodayMeal } from "../services/todayMeal";
import styles from "../styles/TodayMealPage.module.css";

export default function Days() {
  const { clientId } = useParams();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayMeal = async () => {
      try {
        const data = await getTodayMeal(clientId);
        setMeals(data.meals);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTodayMeal();
  }, [clientId]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Today's Meals</h1>
      {meals.length > 0 ? (
        meals.map((meal, index) => (
          <div key={index} className={styles.mealCard}>
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
        ))
      ) : (
        <p>No meals scheduled for today.</p>
      )}
    </div>
  );
}