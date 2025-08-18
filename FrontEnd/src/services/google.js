import { API_BASE_URL } from "../config/api";

export async function authorizeUrl() {
  const accessToken = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/integrations/google/authorize`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authorize URL");
  }

  const data = await response.json();
  return data;
}

export async function getGoogleConnectionStatus() {
  const accessToken = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/integrations/google/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Google connection status");
  }

  return response.json();
}

export async function disconnectGoogle() {
  const accessToken = sessionStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/integrations/google/disconnect`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to disconnect Google account");
  }

  return response.json();
}
