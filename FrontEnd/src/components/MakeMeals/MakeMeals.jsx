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
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../hooks/useTheme";
import BackButton from "../common/BackButton";

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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const weekDayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dayTranslationKeyMap = {
    Δευτέρα: "monday",
    Τρίτη: "tuesday",
    Τετάρτη: "wednesday",
    Πέμπτη: "thursday",
    Παρασκευή: "friday",
    Σάββατο: "saturday",
    Κυριακή: "sunday",
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
    Sunday: "sunday",
  };

  const getDayKey = (dayTitle) =>
    dayTranslationKeyMap[dayTitle] || dayTitle.toLowerCase();

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
        toast.error(
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

  const handleImportFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!client || !client.dieticianId) {
      toast.error("Client data is not loaded yet, or dietician ID is missing.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await postMealPlanAI(file, clientId, client.dieticianId);
      if (response && response.days && Array.isArray(response.days)) {
        const mealsWithDays = response.days.flatMap((day) =>
          day.meals.map((meal) => ({
            ...meal,
            days: [getDayKey(day.title)],
          }))
        );

        const groupedMeals = mealsWithDays.reduce((acc, meal) => {
          const existingMeal = acc.find(
            (m) => m.description === meal.description
          );
          if (existingMeal) {
            if (!existingMeal.days.includes(meal.days[0])) {
              existingMeal.days.push(meal.days[0]);
            }
          } else {
            acc.push({
              ...initialMealState,
              ...meal,
              id: Date.now() + Math.random(),
            });
          }
          return acc;
        }, []);

        setMeals((prevMeals) => [...prevMeals, ...groupedMeals]);
      } else {
        toast.error(t("make_meals.invalid_file_format"));
      }
    } catch (error) {
      console.error("Error importing meal plan:", error);
      toast.error(t("make_meals.error_importing_file"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const createdMealPlan = await createMealPlan(mealPlanData);
      toast.success("Meal plan created successfully!");
      navigate(`/meal-plan-details/${createdMealPlan.id}`);
    } catch (error) {
      const errorData = JSON.parse(error.message);
      if (errorData.errors && errorData.errors["$.clientId"]) {
        toast.error("Invalid Client ID. Please check the URL.");
      } else {
        toast.error("An error occurred while creating the meal plan.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <ToastContainer theme={theme} />
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
        <button type="submit" className={styles.saveMealPlanButton}>
          {t("make_meals.save_meal_plan")}
        </button>

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
