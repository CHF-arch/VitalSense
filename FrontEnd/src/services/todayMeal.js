import { API_BASE_URL } from "../config/api";

export const getTodayMeal = async (clientId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
