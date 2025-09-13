import { logoutUser } from "./auth";
import { isAccessTokenExpired, refreshAccessToken } from "./token";

const getAuthHeaders = (token) => {
  const accessToken = token || sessionStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
};

export const fetchWithAuth = async (url, options = {}) => {
  if (isAccessTokenExpired()) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      throw new Error("Session expired. Please log in again.");
    }
  }

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
  if (isAccessTokenExpired()) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      throw new Error("Session expired. Please log in again.");
    }
  }

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
