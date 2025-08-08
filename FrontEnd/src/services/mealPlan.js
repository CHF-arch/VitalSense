import { API_BASE_URL } from "../config/api";

export const createMealPlan = async (mealPlanData) => {
  const token = localStorage.getItem("token");
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
