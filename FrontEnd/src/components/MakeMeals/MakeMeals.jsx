import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { createMealPlan } from "../../services/mealPlan";
import { getClientById, updateClient } from "../../services/client";
import ClientInfoCard from "../ClientInfoCard";
import ClientEditForm from "./ClientEditForm";
import PlanDetails from "./PlanDetails";
import MealCard from "./MealCard";
import styles from "../../styles/MakeMeals.module.css";

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

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    // Get unique meal titles
    const mealTitles = [...new Set(meals.map((meal) => meal.title))];

    // Header Row
    const header = ["Time", "Meal", ...weekDays];
    wsData.push(header);

    // Group meals by title
    const groupedMeals = mealTitles.reduce((acc, title) => {
      acc[title] = meals.filter((meal) => meal.title === title);
      return acc;
    }, {});

    // Create a row for each meal title
    for (const title in groupedMeals) {
      const mealsByTitle = groupedMeals[title];
      const row = [mealsByTitle[0].time, title];

      weekDays.forEach((day) => {
        const mealForDay = mealsByTitle.find((meal) => meal.days.includes(day));
        if (mealForDay) {
          row.push(mealForDay.description);
        } else {
          row.push("");
        }
      });
      wsData.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Meal Plan");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${planTitle || "MealPlan"}.xlsx`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleExportToExcel();

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
        <ClientEditForm
          editedClientData={editedClientData}
          onInputChange={handleClientInputChange}
          onSave={handleSaveClient}
          onCancel={handleCancelEdit}
        />
      ) : (
        <p>Loading client info...</p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <PlanDetails
          planTitle={planTitle}
          setPlanTitle={setPlanTitle}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <div className={styles.mealsContainer}>
          {meals.map((meal, mealIndex) => (
            <MealCard
              key={meal.id}
              meal={meal}
              mealIndex={mealIndex}
              onMealChange={handleMealChange}
              onDayToggle={handleDayToggle}
            />
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