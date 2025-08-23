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
import { useTranslation } from "react-i18next";

const initialMealState = {
  title: "",
  time: "",
  description: "",
  protein: 0,
  carbs: 0,
  fats: 0,
  calories: 0,
  days: [],
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
  const { t } = useTranslation();
  const weekDayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

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
    setMeals([...meals, { ...initialMealState, id: Date.now() }]);
  };

  const handleMealChange = (mealIndex, e) => {
    const { name, value } = e.target;
    const newMeals = [...meals];
    newMeals[mealIndex][name] = value;
    setMeals(newMeals);
  };

  const handleDayToggle = (mealIndex, dayKey) => {
    const newMeals = JSON.parse(JSON.stringify(meals));
    const currentMeal = newMeals[mealIndex];
    const dayIndexInCurrentMeal = currentMeal.days.indexOf(dayKey);

    if (dayIndexInCurrentMeal === -1) {
      const mealOnSameDay = newMeals.find(
        (meal, index) =>
          index !== mealIndex &&
          meal.days.includes(dayKey) &&
          meal.title.toLowerCase() === currentMeal.title.toLowerCase() &&
          currentMeal.title.trim() !== ""
      );

      if (mealOnSameDay) {
        alert(
          `"${t("make_meals.a_meal_with_the_title")}" "${
            currentMeal.title
          }" "${t("make_meals.already_exist")}" ${t(`days.${dayKey}`)}.`
        );
        return;
      }
      currentMeal.days.push(dayKey);
    } else {
      currentMeal.days.splice(dayIndexInCurrentMeal, 1);
    }

    setMeals(newMeals);
  };

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    const header = ["Time", "Meal", ...weekDayKeys.map((key) => t(`days.${key}`))];
    wsData.push(header);

    // Create a composite key for grouping: `time-title`
    const groupedMeals = meals.reduce((acc, meal) => {
      const key = `${meal.time}-${meal.title}`;
      if (!acc[key]) {
        acc[key] = {
          time: meal.time,
          title: meal.title,
          days: {},
        };
      }
      meal.days.forEach((dayKey) => {
        if (!acc[key].days[t(`days.${dayKey}`)]) {
          acc[key].days[t(`days.${dayKey}`)] = [];
        }
        acc[key].days[t(`days.${dayKey}`)].push(meal.description);
      });
      return acc;
    }, {});

    for (const key in groupedMeals) {
      const mealGroup = groupedMeals[key];
      const row = [mealGroup.time, mealGroup.title];

      weekDayKeys.map((key) => t(`days.${key}`)).forEach((day) => {
        if (mealGroup.days[day]) {
          row.push(mealGroup.days[day].join(", "));
        } else {
          row.push("");
        }
      });
      wsData.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Meal Plan");
    XLSX.writeFile(wb, `${planTitle || "MealPlan"}.xlsx`);
  };

  const handleImportFromExcel = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log("Imported Excel data (raw JSON):", json);

        alert(
          "Excel file imported. Check console for raw data. Please provide the desired JSON schema for meal plans."
        );
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleExportToExcel();

    const daysData = weekDayKeys.map((dayKey) => ({
      title: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
      meals: [],
    }));

    meals.forEach((meal) => {
      const { days, ...mealDetails } = meal;
      days.forEach((dayKey) => {
        const dayObject = daysData.find((d) => d.title.toLowerCase() === dayKey);
        if (dayObject) {
          dayObject.meals.push(mealDetails);
        }
      });
    });
    const dieticianId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    const mealPlanData = {
      title: planTitle,
      startDate,
      endDate,
      dieticianId,
      clientId: clientId,
      days: daysData.filter((day) => day.meals.length > 0),
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
      <h1 className={styles.h1}>{t("make_meals.create_new_meal_plan")}</h1>
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
        <p>{t("make_meals.loading_client_info")}</p>
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
            {t("make_meals.add_meal")}
          </button>
          {/* New Import Button */}
          <input
            type="file"
            id="excelFileInput"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={handleImportFromExcel}
          />
          <button
            type="button"
            onClick={() => document.getElementById("excelFileInput").click()}
            className={styles.importButton}
          >
            {t("make_meals.import_from_excel")}
          </button>
        </div>

        <button type="submit" className={styles.saveMealPlanButton}>
          {t("make_meals.save_meal_plan")}
        </button>
      </form>
    </div>
  );
}
