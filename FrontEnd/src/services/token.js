import { API_BASE_URL } from "../config/api";
import useAuthStore from "../context/authStore";

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      useAuthStore
        .getState()
        .setAuthData(
          data.accessToken,
          data.accessTokenExpiry,
          data.user.username
        );
      return data;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}
