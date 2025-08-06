import { useState } from "react";
import styles from "../styles/Days.module.css";

export default function Days() {
  const [allDays, setAllDays] = useState(false);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [currentDay] = useState(days[new Date().getDay()]);

  const weeklyMeals = {
    Sunday: [
      { id: 1, name: "Πρωινό", description: "Pancakes with maple syrup" },
      { id: 2, name: "Δεκατιανό", description: "Fruit salad" },
      {
        id: 3,
        name: "Μεσημεριανό",
        description: "Roast chicken with potatoes",
      },
      { id: 4, name: "Απογευματινό", description: "Yogurt with granola" },
      { id: 5, name: "Βραδινό", description: "Pasta with tomato sauce" },
    ],
    Monday: [
      { id: 1, name: "Πρωινό", description: "Oatmeal with berries" },
      { id: 2, name: "Δεκατιανό", description: "Handful of almonds" },
      { id: 3, name: "Μεσημεριανό", description: "Lentil soup" },
      { id: 4, name: "Απογευματινό", description: "Rice pudding" },
      {
        id: 5,
        name: "Βραδινό",
        description: "Grilled fish with steamed vegetables",
      },
    ],
    Tuesday: [
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
    ],
    Wednesday: [
      { id: 1, name: "Πρωινό", description: "Scrambled eggs with toast" },
      { id: 2, name: "Δεκατιανό", description: "Banana" },
      { id: 3, name: "Μεσημεριανό", description: "Beef stir-fry with rice" },
      { id: 4, name: "Απογευματινό", description: "Cheese and crackers" },
      { id: 5, name: "Βραδινό", description: "Vegetable curry" },
    ],
    Thursday: [
      { id: 1, name: "Πρωινό", description: "Smoothie with spinach and fruit" },
      { id: 2, name: "Δεκατιανό", description: "Hard-boiled egg" },
      { id: 3, name: "Μεσημεριανό", description: "Tuna salad sandwich" },
      {
        id: 4,
        name: "Απογευματινό",
        description: "Cottage cheese with peaches",
      },
      { id: 5, name: "Βραδινό", description: "Pork chops with applesauce" },
    ],
    Friday: [
      { id: 1, name: "Πρωινό", description: "Cereal with milk" },
      { id: 2, name: "Δεκατιανό", description: "Orange" },
      { id: 3, name: "Μεσημεριανό", description: "Spaghetti bolognese" },
      { id: 4, name: "Απογευματινό", description: "Muffin" },
      { id: 5, name: "Βραδινό", description: "Pizza" },
    ],
    Saturday: [
      { id: 1, name: "Πρωινό", description: "French toast" },
      { id: 2, name: "Δεκατιανό", description: "Grapes" },
      { id: 3, name: "Μεσημεριανό", description: "Burgers and fries" },
      { id: 4, name: "Απογευματινό", description: "Ice cream" },
      { id: 5, name: "Βραδινό", description: "Tacos" },
    ],
  };

  const todaysMeals = weeklyMeals[currentDay];
  const handleAllDays = () => {
    setAllDays(!allDays);
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{currentDay}'s Meals</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Meal</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {todaysMeals.map((meal) => (
            <tr key={meal.id}>
              <td>{meal.name}</td>
              <td>{meal.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAllDays}>See All Days Meals</button>
      {allDays && (
        <div>
          {days.map((day) => {
            const dayMeals = weeklyMeals[day];
            return (
              <div key={day}>
                <h2>{day} Meals</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Meal</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayMeals.map((meal) => (
                      <tr key={meal.id}>
                        <td>{meal.name}</td>
                        <td>{meal.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
