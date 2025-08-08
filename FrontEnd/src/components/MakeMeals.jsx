import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createMealPlan } from "../services/mealPlan";
import { getClientById, updateClient } from "../services/client";
import ClientInfoCard from "./ClientInfoCard";
import styles from "../styles/MakeMeals.module.css";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialMealState = {
  title: "",
  time: "",
  description: "",
  protein: 0,
  carbs: 0,
  fats: 0,
  calories: 0,
  days: [], // Array to hold the days this meal applies to
};

export default function MakeMeals() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [planTitle, setPlanTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meals, setMeals] = useState([]);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState({});

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    fetchClient();
  }, [clientId]);

  const handleAddMeal = () => {
    setMeals([...meals, { ...initialMealState, id: Date.now() }]); // Add a temporary unique id
  };

  const handleMealChange = (mealIndex, e) => {
    const { name, value } = e.target;
    const newMeals = [...meals];
    newMeals[mealIndex][name] = value;
    setMeals(newMeals);
  };

  const handleDayToggle = (mealIndex, day) => {
    const newMeals = JSON.parse(JSON.stringify(meals)); // Deep copy to avoid state mutation issues
    const currentMeal = newMeals[mealIndex];
    const dayIndexInCurrentMeal = currentMeal.days.indexOf(day);

    if (dayIndexInCurrentMeal === -1) {
      // Check for conflicts before adding
      const mealOnSameDay = newMeals.find(
        (meal, index) =>
          index !== mealIndex &&
          meal.days.includes(day) &&
          meal.title.toLowerCase() === currentMeal.title.toLowerCase() &&
          currentMeal.title.trim() !== ""
      );

      if (mealOnSameDay) {
        alert(
          `A meal with the title "${currentMeal.title}" already exists on ${day}.`
        );
        return;
      }
      currentMeal.days.push(day);
    } else {
      currentMeal.days.splice(dayIndexInCurrentMeal, 1);
    }

    setMeals(newMeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const daysData = weekDays.map((day) => ({
      title: day,
      meals: [],
    }));

    meals.forEach((meal) => {
      const { days, ...mealDetails } = meal; // Exclude the temporary id
      days.forEach((day) => {
        const dayObject = daysData.find((d) => d.title === day);
        if (dayObject) {
          dayObject.meals.push(mealDetails);
        }
      });
    });

    // TODO: Replace with actual dieticianId from auth context
    const dieticianId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    const mealPlanData = {
      title: planTitle,
      startDate,
      endDate,
      dieticianId,
      clientId: clientId, // Ensure clientId is passed correctly
      days: daysData.filter((day) => day.meals.length > 0), // Only send days that have meals
    };

    try {
      await createMealPlan(mealPlanData);
      alert("Meal plan created successfully!");
    } catch (error) {
      const errorData = JSON.parse(error.message);
      if (errorData.errors && errorData.errors["$.clientId"]) {
        alert("Invalid Client ID. Please check the URL.");
      } else {
        alert("An error occurred while creating the meal plan.");
      }
    }
  };

  const handleEditClient = () => {
    setIsEditingClient(true);
    setEditedClientData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth.split("T")[0],
      gender: client.gender,
      hasCard: client.hasCard,
      notes: client.notes,
    });
  };

  const handleCancelEdit = () => {
    setIsEditingClient(false);
    setEditedClientData({});
  };

  const handleClientInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedClientData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveClient = async () => {
    try {
      const updatedClient = { ...client, ...editedClientData };
      await updateClient(clientId, updatedClient);
      setClient(updatedClient);
      setIsEditingClient(false);
      alert("Client updated successfully!");
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Create a New Meal Plan</h1>
      {client && !isEditingClient ? (
        <ClientInfoCard client={client} onEditClick={handleEditClient} />
      ) : client && isEditingClient ? (
        <div className={styles.editForm}>
          <div className={styles.formRow}>
            <label htmlFor="editFirstName">First Name</label>
            <input
              id="editFirstName"
              type="text"
              name="firstName"
              value={editedClientData.firstName}
              onChange={handleClientInputChange}
              className={styles.inputField}
            />
            <label htmlFor="editLastName">Last Name</label>
            <input
              id="editLastName"
              type="text"
              name="lastName"
              value={editedClientData.lastName}
              onChange={handleClientInputChange}
              className={styles.inputField}
            />
            <label htmlFor="editEmail">Email</label>
            <input
              id="editEmail"
              type="email"
              name="email"
              value={editedClientData.email}
              onChange={handleClientInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="editPhone">Phone</label>
            <input
              id="editPhone"
              type="text"
              name="phone"
              value={editedClientData.phone}
              onChange={handleClientInputChange}
              className={styles.inputField}
            />
            <label htmlFor="editDateOfBirth">Date of Birth</label>
            <input
              id="editDateOfBirth"
              type="date"
              name="dateOfBirth"
              value={editedClientData.dateOfBirth}
              onChange={handleClientInputChange}
              className={styles.inputField}
            />
            <label htmlFor="editGender">Gender</label>
            <select
              id="editGender"
              name="gender"
              value={editedClientData.gender}
              onChange={handleClientInputChange}
              className={styles.inputField}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="editHasCard" className={styles.checkboxLabel}>
              <input
                id="editHasCard"
                type="checkbox"
                name="hasCard"
                checked={editedClientData.hasCard}
                onChange={handleClientInputChange}
              />
              Has Card
            </label>
          </div>
          <label htmlFor="editNotes">Notes</label>
          <textarea
            id="editNotes"
            name="notes"
            value={editedClientData.notes}
            onChange={handleClientInputChange}
            className={styles.textareaField}
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveClient}
            >
              Save Client
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>Loading client info...</p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.planDetails}>
          <label htmlFor="planTitle">Plan Title</label>
          <input
            id="planTitle"
            type="text"
            placeholder="Meal Plan Title"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            required
            className={styles.input}
          />
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={styles.input}
          />
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.mealsContainer}>
          {meals.map((meal, mealIndex) => (
            <div key={meal.id} className={styles.mealCard}>
              <label htmlFor={`mealTitle-${mealIndex}`}>Meal Title</label>
              <input
                id={`mealTitle-${mealIndex}`}
                type="text"
                name="title"
                placeholder="Meal Title (e.g., Breakfast)"
                value={meal.title}
                onChange={(e) => handleMealChange(mealIndex, e)}
                className={styles.mealInput}
              />
              <label htmlFor={`mealTime-${mealIndex}`}>Time</label>
              <input
                id={`mealTime-${mealIndex}`}
                type="time"
                name="time"
                value={meal.time}
                onChange={(e) => handleMealChange(mealIndex, e)}
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
                onChange={(e) => handleMealChange(mealIndex, e)}
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
                    onChange={(e) => handleMealChange(mealIndex, e)}
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
                    onChange={(e) => handleMealChange(mealIndex, e)}
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
                    onChange={(e) => handleMealChange(mealIndex, e)}
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
                    onChange={(e) => handleMealChange(mealIndex, e)}
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
                        onChange={() => handleDayToggle(mealIndex, day)}
                      />
                      {day.substring(0, 3)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={handleAddMeal}
            className={styles.addMealButton}
          >
            Add Meal
          </button>
        </div>

        <button type="submit" className={styles.saveMealPlanButton}>
          Save Meal Plan
        </button>
      </form>
    </div>
  );
}
