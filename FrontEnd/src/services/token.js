import { API_BASE_URL } from "../config/api";
import { logoutUser } from "./auth";

export async function refreshAccessToken() {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) {
      logoutUser();
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      logoutUser();
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      sessionStorage.setItem("token", data.accessToken);
      sessionStorage.setItem("accessTokenExpiry", data.accessTokenExpiry);
      // Assuming the refresh endpoint also returns a new refresh token if it's rotated
      if (data.refreshToken) {
        sessionStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logoutUser();
    return null;
  }
}
