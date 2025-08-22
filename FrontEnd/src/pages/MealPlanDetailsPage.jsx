import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealPlanById } from "../services/mealPlan";
import { getClientById } from "../services/client";
import WeeklyMealPlanTable from "../components/WeeklyMealPlanTable/WeeklyMealPlanTable";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";
import styles from "../styles/MealPlanDetailsPage.module.css";

export default function MealPlanDetailsPage() {
  const { mealPlanId } = useParams();
  const [mealPlan, setMealPlan] = useState(null);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const mealPlanData = await getMealPlanById(mealPlanId);
        setMealPlan(mealPlanData);

        // Fetch client name
        if (mealPlanData && mealPlanData.clientId) {
          const clientData = await getClientById(mealPlanData.clientId);
          setClientName(`${clientData.firstName} ${clientData.lastName}`);
        }
      } catch (err) {
        setError(t("meal_plan_details.failed_to_fetch"));
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mealPlanId) {
      fetchDetails();
    }
  }, [mealPlanId, t]);

  if (loading) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        {t("meal_plan_details.loading_details")}
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
        <p className={styles.noMealPlan}>{t("meal_plan_details.not_found")}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.title}>
        {t("meal_plan_details.meal_plan_title")}: {mealPlan.title || t("meal_plan_details.id") + `: ${mealPlan.id}`}
      </h1>
      <p className={styles.clientInfo}>
        <strong>{t("meal_plan_details.start_date")}:</strong>{" "}
        {new Date(mealPlan.startDate).toLocaleDateString()}
      </p>
      <p className={styles.clientInfo}>
        <strong>{t("meal_plan_details.end_date")}:</strong>{" "}
        {new Date(mealPlan.endDate).toLocaleDateString()}
      </p>
      <p className={styles.clientInfo}>
        <strong>{t("meal_plan_details.client")}:</strong> {clientName || t("meal_plan_details.loading_client")}
      </p>

      <h2 className={styles.sectionTitle}>{t("meal_plan_details.weekly_overview")}</h2>
      <WeeklyMealPlanTable mealPlan={mealPlan} />
    </div>
  );
}
