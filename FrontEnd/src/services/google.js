import { API_BASE_URL } from "../config/api";

export async function authorizeUrl() {
  const response = await fetch(
    `${API_BASE_URL}/integrations/google/authorize`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authorize URL");
  }

  const data = await response.json();
  return data.url;
}
