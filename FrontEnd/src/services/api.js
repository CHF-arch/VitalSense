import { logoutUser } from "./auth";
import { refreshAccessToken } from "./token";

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
  let config = {
    ...options,
    headers: getAuthHeaders(),
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      config = {
        ...options,
        headers: getAuthHeaders(newAccessToken),
      };
      response = await fetch(url, config);
    } else {
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export const fetchWithAuthForFormData = async (url, options = {}) => {
  const getHeaders = (token) => {
    const accessToken = token || sessionStorage.getItem("token");
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  };

  let config = {
    ...options,
    headers: getHeaders(),
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      config = {
        ...options,
        headers: getHeaders(newAccessToken),
      };
      response = await fetch(url, config);
    } else {
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};
