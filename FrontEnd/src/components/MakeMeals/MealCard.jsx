import React from 'react';
import styles from '../../styles/MakeMeals.module.css';

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MealCard = ({ meal, mealIndex, onMealChange, onDayToggle }) => {
  return (
    <div key={meal.id} className={styles.mealCard}>
      <label htmlFor={`mealTitle-${mealIndex}`}>Meal Title</label>
      <input
        id={`mealTitle-${mealIndex}`}
        type="text"
        name="title"
        placeholder="Meal Title (e.g., Breakfast)"
        value={meal.title}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <label htmlFor={`mealTime-${mealIndex}`}>Time</label>
      <input
        id={`mealTime-${mealIndex}`}
        type="time"
        name="time"
        value={meal.time}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <label htmlFor={`mealDescription-${mealIndex}`}>
        Description
      </label>
      <textarea
        id={`mealDescription-${mealIndex}`}
        name="description"
        placeholder="Description"
        value={meal.description}
        onChange={(e) => onMealChange(mealIndex, e)}
        className={styles.mealInput}
      />
      <div className={styles.nutritionRow}>
        <div>
          <label htmlFor={`protein-${mealIndex}`}>Protein (g)</label>
          <input
            id={`protein-${mealIndex}`}
            type="number"
            name="protein"
            placeholder="Protein (g)"
            value={meal.protein}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`carbs-${mealIndex}`}>Carbs (g)</label>
          <input
            id={`carbs-${mealIndex}`}
            type="number"
            name="carbs"
            placeholder="Carbs (g)"
            value={meal.carbs}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`fats-${mealIndex}`}>Fats (g)</label>
          <input
            id={`fats-${mealIndex}`}
            type="number"
            name="fats"
            placeholder="Fats (g)"
            value={meal.fats}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
        <div>
          <label htmlFor={`calories-${mealIndex}`}>Calories</label>
          <input
            id={`calories-${mealIndex}`}
            type="number"
            name="calories"
            placeholder="Calories"
            value={meal.calories}
            onChange={(e) => onMealChange(mealIndex, e)}
            className={styles.mealInput}
          />
        </div>
      </div>
      <div className={styles.daysSelection}>
        <p>Select days for this meal:</p>
        <div className={styles.checkboxGroup}>
          {weekDays.map((day) => (
            <label key={day} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={meal.days.includes(day)}
                onChange={() => onDayToggle(mealIndex, day)}
              />
              {day.substring(0, 3)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
