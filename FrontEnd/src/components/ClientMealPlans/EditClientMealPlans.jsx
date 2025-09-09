import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMealPlanById, editMealPlan } from "../../services/mealPlan";
import { useTheme } from "../../hooks/useTheme";
import styles from "../../styles/EditClientMealPlans.module.css";
import { useTranslation } from "react-i18next";
import PlanDetails from "../MakeMeals/PlanDetails";
import MealCard from "../MakeMeals/MealCard";

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

export default function EditClientMealPlans() {
  const { mealPlanId } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
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
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const data = await getMealPlanById(mealPlanId);
        setMealPlan(data);

        // Transform and group meals by description
        const mealsWithDays = data.days.flatMap((day) =>
          day.meals.map((meal) => ({
            ...meal,
            days: [day.title.toLowerCase()],
          }))
        );

        const groupedMeals = mealsWithDays.reduce((acc, meal) => {
          const existingMeal = acc.find(
            (m) => m.description === meal.description
          );
          if (existingMeal) {
            // Make sure not to add duplicate days
            if (!existingMeal.days.includes(meal.days[0])) {
              existingMeal.days.push(...meal.days);
            }
          } else {
            acc.push({ ...meal, id: meal._id || Date.now() + Math.random() });
          }
          return acc;
        }, []);

        setMeals(groupedMeals);
      } catch (err) {
        setError("Failed to fetch meal plan details.");
        console.error("Error fetching meal plan:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mealPlanId) {
      fetchMealPlan();
    }
  }, [mealPlanId]);

  const handlePlanDetailsChange = (name, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    const updatedMealPlanData = {
      ...mealPlan,
      days: daysData.filter((day) => day.meals.length > 0),
    };

    try {
      await editMealPlan(mealPlanId, updatedMealPlanData);
      alert(t("edit_meal_plan.success_message"));
      navigate(`/meal-plan-details/${mealPlanId}`);
    } catch (err) {
      setError("Failed to update meal plan.");
      console.error("Error updating meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        {t("edit_meal_plan.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        {t("edit_meal_plan.not_found")}
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.title}>{t("edit_meal_plan.title")}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button type="submit" className={styles.submitButton}>
          {t("edit_meal_plan.save_changes")}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          {t("common.cancel")}
        </button>
        <PlanDetails
          planTitle={mealPlan.title}
          setPlanTitle={(value) => handlePlanDetailsChange("title", value)}
          startDate={
            mealPlan.startDate
              ? new Date(mealPlan.startDate).toISOString().split("T")[0]
              : ""
          }
          setStartDate={(value) => handlePlanDetailsChange("startDate", value)}
          endDate={
            mealPlan.endDate
              ? new Date(mealPlan.endDate).toISOString().split("T")[0]
              : ""
          }
          setEndDate={(value) => handlePlanDetailsChange("endDate", value)}
        />

        <div className={styles.mealsContainer}>
          {" "}
          {/* Need to add mealsContainer style */}
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
          {" "}
          {/* Need to add controls style */}
          <button
            type="button"
            onClick={handleAddMeal}
            className={styles.addMealButton} // Need to add addMealButton style
          >
            {t("make_meals.add_meal")}
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          {t("edit_meal_plan.save_changes")}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          {t("common.cancel")}
        </button>
      </form>
    </div>
  );
}
