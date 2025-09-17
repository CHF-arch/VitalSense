import { API_BASE_URL } from "../config/api";
import { logoutUser } from "./auth";

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logoutUser();
    return null;
  }

  try {
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
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("accessTokenExpiry", data.accessTokenExpiry);
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logoutUser();
    return null;
  }
}
