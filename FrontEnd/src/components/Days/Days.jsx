import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getActiveMealPlanByClientId } from "../../services/mealPlan";
import TodayMealsDisplay from "./TodayMealsDisplay";
import FullWeekMealsDisplay from "./FullWeekMealsDisplay";
import styles from "../../styles/TodayMealPage.module.css";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function Days() {
  const { clientId } = useParams();
  const [activeMealPlan, setActiveMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullWeek, setShowFullWeek] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const dayTranslationKeyMap = {
    "Δευτέρα": "monday",
    "Τρίτη": "tuesday",
    "Τετάρτη": "wednesday",
    "Πέμπτη": "thursday",
    "Παρασκευή": "friday",
    "Σάββατο": "saturday",
    "Κυριακή": "sunday",
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
    const fetchActiveMealPlan = async () => {
      try {
        setLoading(true);
        const data = await getActiveMealPlanByClientId(clientId);
        setActiveMealPlan(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching active meal plan:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchActiveMealPlan();
    }
  }, [clientId]);

  if (loading) {
    return <div className={styles.container}>{t("days.loading")}</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        {t("days.error", { message: error.message })}
      </div>
    );
  }

  if (!activeMealPlan) {
    return (
      <div className={styles.container}>{t("days.no_active_meal_plan")}</div>
    );
  }

  // Sorting logic for today's meals
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayMeals =
    activeMealPlan?.days?.find((day) => getDayKey(day.title) === today)?.meals || [];
  const sortedTodayMeals = [...todayMeals].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  // Sorting logic for weekly view
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const sortedDays = activeMealPlan?.days
    ? [...activeMealPlan.days]
        .sort((a, b) => dayOrder.indexOf(getDayKey(a.title)) - dayOrder.indexOf(getDayKey(b.title)))
        .map((day) => ({
          ...day,
          meals: [...day.meals].sort((a, b) => a.time.localeCompare(b.time)),
        }))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>
          {showFullWeek
            ? t("days.full_week_meal_plan")
            : t("days.todays_meals")}
        </h1>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowFullWeek(!showFullWeek)}
            className={styles.toggleButton}
          >
            {showFullWeek ? t("days.show_today") : t("days.show_full_week")}
          </button>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            {theme === "light" ? t("days.dark_mode") : t("days.light_mode")}
          </button>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
            className={styles.languageSelect}
          >
            <option value="en">{t("settings.english")}</option>
            <option value="el">{t("settings.greek")}</option>
          </select>
        </div>
      </div>

      {showFullWeek ? (
        <FullWeekMealsDisplay sortedDays={sortedDays} />
      ) : (
        <TodayMealsDisplay sortedTodayMeals={sortedTodayMeals} />
      )}
    </div>
  );
}
