import { API_BASE_URL } from "../config/api";
import { logoutUser } from "./auth";

export async function refreshAccessToken() {
  try {
    // The POST request should be empty, as the refresh token is in an HttpOnly cookie.
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookies
      body: JSON.stringify({}), // Empty body
    });

    if (!response.ok) {
      logoutUser();
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      // Only save the new access token. The new refresh token is handled by the backend in the cookie.
      sessionStorage.setItem("token", data.accessToken);
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
