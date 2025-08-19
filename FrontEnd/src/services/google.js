import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export async function authorizeUrl() {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/integrations/google/authorize`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authorize URL");
  }

  const data = await response.json();
  return data;
}

export async function getGoogleConnectionStatus() {
  const response = await fetchWithAuth(`${API_BASE_URL}/integrations/google/status`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get Google connection status");
  }

  return response.json();
}

export async function disconnectGoogle() {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/integrations/google/disconnect`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to disconnect Google account");
  }

  return response.json();
}
