import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export async function fetchQuestionnaireTemplates() {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/questionnaire-templates`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch questionnaire templates");
  }
  return response.json();
}

export async function createQuestionnaireTemplate(data) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/questionnaire-templates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create questionnaire template");
  }
  return response.json();
}
export async function updateQuestionnaireTemplate(id, data) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/questionnaire-templates/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update questionnaire template");
  }
  return response.json();
}
export async function deleteQuestionnaireTemplate(id) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/questionnaire-templates/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete questionnaire template");
  }
  return response.json();
}

export async function fetchQuestionnaireTemplateById(id) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/questionnaire-templates/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch questionnaire template");
  }
  return response.json();
}
