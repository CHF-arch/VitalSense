import { API_BASE_URL } from "../config/api";

export const createMealPlan = async (mealPlanData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealPlanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create meal plan.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating meal plan:", error);
    throw error;
  }
};

export const getMealPlansByClientId = async (clientId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_BASE_URL}/meal-plans/client/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch meal plans.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    throw error;
  }
};

export const getMealPlanById = async (mealPlanId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${mealPlanId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch meal plan details."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching meal plan details:", error);
    throw error;
  }
};

export const getActiveMealPlanByClientId = async (clientId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_BASE_URL}/meal-plans/${clientId}/active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch active meal plan.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active meal plan:", error);
    throw error;
  }
};
