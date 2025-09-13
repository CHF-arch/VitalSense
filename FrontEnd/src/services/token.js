import { API_BASE_URL } from "../config/api";
import { logoutUser } from "./auth";

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}

export function isAccessTokenExpired() {
  const expiry = sessionStorage.getItem("accessTokenExpiry");
  if (!expiry) {
    return true;
  }
  return new Date() > new Date(expiry);
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
      sessionStorage.setItem("token", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("accessTokenExpiry", data.accessTokenExpiry);
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logoutUser();
    return null;
  }
}
