import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { createMealPlan } from "../../services/mealPlan";
import { getClientById } from "../../services/client";
import ClientInfoCard from "../ClientInfoCard";
import PlanDetails from "./PlanDetails";
import MealCard from "./MealCard";
import styles from "../../styles/MakeMeals.module.css";
import { useTranslation } from "react-i18next";
import { postMealPlanAI } from "../../services/mealPlanAI";

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
  const [isLoading, setIsLoading] = useState(false);
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

    const header = [
      "Time",
      "Meal",
      ...weekDayKeys.map((key) => t(`days.${key}`)),
    ];
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
      meal.days.forEach(() => {
        if (!acc[key].days[t(`days.${key}`)]) {
          acc[key].days[t(`days.${key}`)] = [];
        }
        acc[key].days[t(`days.${key}`)].push(meal.description);
      });
      return acc;
    }, {});

    for (const key in groupedMeals) {
      const mealGroup = groupedMeals[key];
      const row = [mealGroup.time, mealGroup.title];

      weekDayKeys
        .map((key) => t(`days.${key}`))
        .forEach((day) => {
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

  const handleImportFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!client || !client.dieticianId) {
      alert("Client data is not loaded yet, or dietician ID is missing.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await postMealPlanAI(file, clientId, client.dieticianId);
      if (response && response.days && Array.isArray(response.days)) {
        const importedMeals = response.days
          .flatMap((day) => day.meals)
          .map((meal) => ({
            ...initialMealState,
            id: Date.now() + Math.random(),
            title: meal.title || "",
            time: meal.time || "",
            description: meal.description || "",
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fats: meal.fats || 0,
            calories: meal.calories || 0,
            days: [],
          }));
        setMeals((prevMeals) => [...prevMeals, ...importedMeals]);
      } else {
        alert(t("make_meals.invalid_file_format"));
      }
    } catch (error) {
      console.error("Error importing meal plan:", error);
      alert(t("make_meals.error_importing_file"));
    } finally {
      setIsLoading(false);
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
        const dayObject = daysData.find(
          (d) => d.title.toLowerCase() === dayKey
        );
        if (dayObject) {
          dayObject.meals.push(mealDetails);
        }
      });
    });

    const mealPlanData = {
      title: planTitle,
      startDate,
      endDate,
      dieticianId: client?.dieticianId,
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

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>{t("make_meals.loading", "Processing your meal plan...")}</p>
        </div>
      )}
      <h1 className={styles.h1}>{t("make_meals.create_new_meal_plan")}</h1>
      {client ? (
        <ClientInfoCard client={client} />
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
