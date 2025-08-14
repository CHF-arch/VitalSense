import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMealPlansByClientId } from "../../services/mealPlan";
import { getClientById } from "../../services/client";
import { useTheme } from "../../hooks/useTheme";
import styles from "../../styles/ClientMealPlans.module.css";
import { useTranslation } from "react-i18next";

export default function ClientMealPlans() {
  const { clientId } = useParams();
  const [mealPlans, setMealPlans] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        setClientName(`${clientData.firstName} ${clientData.lastName}`);
        const mealPlansData = await getMealPlansByClientId(clientId);
        setMealPlans(mealPlansData);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className={`${styles.container} ${styles[theme]}`}>
        Loading meal plans...
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

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.title}>
        {t("client_meal_plans.title")} {clientName}
      </h1>
      {mealPlans.length === 0 ? (
        <p className={styles.noMealPlans}>{t("client_meal_plans.no_meals")}</p>
      ) : (
        <ul className={styles.clientGrid}>
          {mealPlans.map((plan) => (
            <li key={plan.id} className={styles.clientCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.mealPlanName}>
                  {plan.name ||
                    `${t("client_meal_plans.meal_plan")} : ${plan.title}`}
                </h3>
                <div className={styles.cardActions}>
                  <Link
                    to={`/meal-plan-details/${plan.id}`}
                    className={styles.viewDetailsButton}
                    title={t("client_meal_plans.view_meal_plan")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-eye"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className={styles.mealPlanInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    {t("client_meal_plans.start_date")}:
                  </span>
                  <span className={styles.infoText}>
                    {new Date(plan.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    {t("client_meal_plans.end_date")}:
                  </span>
                  <span className={styles.infoText}>
                    {new Date(plan.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
