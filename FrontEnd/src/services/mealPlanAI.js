import { API_BASE_URL } from "../config/api";
import { fetchWithAuthForFormData } from "./api";

export const postMealPlanAI = async (excelFile, clientId, dieticianId) => {
  try {
    const formData = new FormData();
    formData.append("ExcelFile", excelFile);
    formData.append("ClientId", clientId);
    formData.append("DieticianId", dieticianId);

    const response = await fetchWithAuthForFormData(
      `${API_BASE_URL}/meal-plans/convert-excel`,
      {
        method: "POST",
        body: formData,
      }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error uploading meal plan:", error);
    throw error;
  }
};