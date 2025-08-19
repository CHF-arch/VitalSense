import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export const getTodayMeal = async (clientId) => {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/meal-plans/${clientId}/active`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get today's meal.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting today's meal:", error);
    throw error;
  }
};

