import { logoutUser } from "./auth";

const getAuthHeaders = () => {
  const accessToken = sessionStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
};

export const fetchWithAuth = async (url, options = {}) => {
  const config = {
    ...options,
    headers: getAuthHeaders(),
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    logoutUser();
    throw new Error("Session expired. Please log in again.");
  }

  return response;
};

export const fetchWithAuthForFormData = async (url, options = {}) => {
  const accessToken = sessionStorage.getItem("token");
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    logoutUser();
    throw new Error("Session expired. Please log in again.");
  }

  return response;
};
