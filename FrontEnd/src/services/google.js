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

export async function sendGoogleCallback(code, state) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/integrations/google/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send Google callback");
  }

  return response.json();
}

export async function getGoogleConnectionStatus() {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/integrations/google/status`,
    {
      method: "GET",
    }
  );

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

export async function SyncAllFeaturesAppointments() {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/integrations/google-calendar/sync-all-future-appointments`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google Calendar events");
  }

  return response.json();
}
