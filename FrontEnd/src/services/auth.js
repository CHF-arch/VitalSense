import { API_BASE_URL } from "../config/api";

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  const data = await response.json();
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
  }
  return data;
}
export async function signUpUser(username, email, password, confirmPassword) {
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
  return response.json();
}
