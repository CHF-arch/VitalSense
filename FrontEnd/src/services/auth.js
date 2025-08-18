// import { data } from "react-router";
import { API_BASE_URL } from "../config/api";

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed. Please try again.");
    }

    const data = await response.json();
    if (data.accessToken) {
      sessionStorage.setItem("token", data.accessToken);
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
