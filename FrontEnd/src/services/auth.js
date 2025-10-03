import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";
import useAuthStore from "../context/authStore";

export async function logoutUser() {
  useAuthStore.getState().clearAuthData();
  window.location.href = "/login";
}

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed. Please try again.");
    }

    const data = await response.json();
    if (data.accessToken) {
      useAuthStore
        .getState()
        .setAuthData(data.accessToken, data.accessTokenExpiry, username);
    }
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
export async function signUpUser(username, email, password, confirmPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign-up failed. Please try again.");
    }

    return await response.json();
  } catch (error) {
    console.error("Sign-up failed:", error);
    throw error;
  }
}

export async function changePassword(
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Change password failed. Please try again."
    );
  }

  return await response.json();
}

export async function changeEmail(newEmail, currentPassword) {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-email`, {
    method: "POST",
    body: JSON.stringify({
      newEmail: newEmail,
      currentPassword: currentPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Change email failed. Please try again."
    );
  }

  return await response.json();
}

export async function changeUsername(newUsername, currentPassword) {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-username`, {
    method: "POST",
    body: JSON.stringify({
      newUsername: newUsername,
      currentPassword: currentPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Change username failed. Please try again."
    );
  }

  return await response.json();
}
