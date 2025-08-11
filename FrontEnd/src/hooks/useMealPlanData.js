import { useState, useEffect } from "react";
import { getTodayMeal } from "../services/todayMeal";

export const useMealPlanData = (clientId) => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await getTodayMeal(clientId);
        const plan = response[0];
        setMealPlan(plan);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [clientId]);

  return { mealPlan, loading, error };
};
