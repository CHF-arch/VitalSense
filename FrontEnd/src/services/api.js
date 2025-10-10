import { logoutUser } from "./auth";
import { refreshAccessToken } from "./token";
import useAuthStore from "../context/authStore";

const baseFetchWithAuth = async (url, options, getHeaders) => {
  const makeRequest = async (token) => {
    const config = {
      ...options,
      headers: getHeaders(token),
      credentials: "include",
    };
    return fetch(url, config);
  };

  let response = await makeRequest();
  if (response.status === 401 && !options._retry) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      const newOptions = { ...options, _retry: true };
      response = await baseFetchWithAuth(url, newOptions, getHeaders);
    } else {
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export const fetchWithAuth = async (url, options = {}) => {
  const getHeaders = (token) => {
    const accessToken = token || useAuthStore.getState().token;
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  };
  return baseFetchWithAuth(url, options, getHeaders);
};

export const fetchWithAuthForFormData = async (url, options = {}) => {
  const getHeaders = (token) => {
    const accessToken = token || useAuthStore.getState().token;
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  };
  return baseFetchWithAuth(url, options, getHeaders);
};