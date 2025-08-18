import { API_BASE_URL } from "../config/api";

export async function getDashboardData() {
  const accessToken = sessionStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
