import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export const createMealPlan = async (mealPlanData) => {
  try {
    // Create a deep copy to avoid modifying the original mealPlanData object
    const dataToSend = JSON.parse(JSON.stringify(mealPlanData));

    // Remove meal IDs from meals within the 'days' array
    if (dataToSend.days && Array.isArray(dataToSend.days)) {
      dataToSend.days = dataToSend.days.map((day) => {
        if (day.meals && Array.isArray(day.meals)) {
          day.meals = day.meals.map((meal) => {
            const { id, ...rest } = meal; // Destructure to exclude id
            return rest;
          });
        }
        return day;
      });
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/meal-plans`, {
      method: "POST",
      body: JSON.stringify(dataToSend), // Send the filtered data
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
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/meal-plans/client/${clientId}`,
      {
        method: "GET",
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
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/meal-plans/${mealPlanId}`,
      {
        method: "GET",
      }
    );

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
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/meal-plans/${clientId}/active`,
      {
        method: "GET",
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

export const editMealPlan = async (mealPlanId, updatedData, dietitianId) => {
  // Added dietitianId parameter
  try {
    // Create a deep copy to avoid modifying the original updatedData object
    const dataToSend = JSON.parse(JSON.stringify(updatedData));

    // Add dietitianId to the dataToSend object
    dataToSend.dietitianId = dietitianId; // NEW LINE

    // Remove mealPlanId from the body if it exists
    if (dataToSend.id) {
      delete dataToSend.id;
    }

    // Remove meal IDs from the meals array if it exists (top-level)
    if (dataToSend.meals && Array.isArray(dataToSend.meals)) {
      dataToSend.meals = dataToSend.meals.map((meal) => {
        const { id, ...rest } = meal; // Destructure to exclude id
        return rest;
      });
    }

    // NEW: Remove meal IDs from meals within the 'days' array
    if (dataToSend.days && Array.isArray(dataToSend.days)) {
      dataToSend.days = dataToSend.days.map((day) => {
        if (day.meals && Array.isArray(day.meals)) {
          day.meals = day.meals.map((meal) => {
            const { id, ...rest } = meal; // Destructure to exclude id
            return rest;
          });
        }
        return day;
      });
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/meal-plans/${mealPlanId}`,
      {
        method: "PUT",
        body: JSON.stringify(dataToSend), // Send the filtered data
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update meal plan.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating meal plan:", error);
    throw error;
  }
};
