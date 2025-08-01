import { useState } from "react";
import styles from "../styles/Days.module.css";

export default function Days() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayId = useState(days[new Date().getDay()]);

  const meals = [
    { id: 1, name: "Πρωινό", description: "Omelette with vegetables" },
    {
      id: 2,
      name: "Δεκατιανό",
      description: "Greek yogurt with honey and nuts",
    },
    {
      id: 3,
      name: "Μεσημεριανό",
      description: "Grilled chicken with quinoa salad",
    },
    {
      id: 4,
      name: "Απογευματινό",
      description: "Apple slices with peanut butter",
    },
    {
      id: 5,
      name: "Βραδινό",
      description: "Salmon with roasted sweet potatoes",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Today's Meals: {dayId}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Meal</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id}>
              <td>{meal.name}</td>
              <td>{meal.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}