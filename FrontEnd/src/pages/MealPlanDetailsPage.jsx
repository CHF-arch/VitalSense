import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealPlanById } from "../services/mealPlan";
import { getClientById } from "../services/client";
import WeeklyMealPlanTable from "../components/WeeklyMealPlanTable/WeeklyMealPlanTable";
import { useTheme } from "../hooks/useTheme";
import styles from "../styles/MealPlanDetailsPage.module.css";

export default function MealPlanDetailsPage() {
  const { mealPlanId } = useParams();
  const [mealPlan, setMealPlan] = useState(null);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

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
        setError("Failed to fetch details.");
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mealPlanId) {
      fetchDetails();
    }
  }, [mealPlanId]);

  if (loading) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        Loading meal plan details...
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
        <p className={styles.noMealPlan}>Meal plan not found.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.title}>
        Meal Plan: {mealPlan.title || `ID: ${mealPlan.id}`}
      </h1>
      <p className={styles.clientInfo}>
        <strong>Start Date:</strong>{" "}
        {new Date(mealPlan.startDate).toLocaleDateString()}
      </p>
      <p className={styles.clientInfo}>
        <strong>End Date:</strong>{" "}
        {new Date(mealPlan.endDate).toLocaleDateString()}
      </p>
      <p className={styles.clientInfo}>
        <strong>Client:</strong> {clientName || "Loading..."}
      </p>

      <h2 className={styles.sectionTitle}>Weekly Overview:</h2>
      <WeeklyMealPlanTable mealPlan={mealPlan} />
    </div>
  );
}
