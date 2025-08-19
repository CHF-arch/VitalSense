import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export async function getDashboardData() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/dashboard/metrics`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
