import { logoutUser } from "./auth";
import { refreshAccessToken } from "./token";

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
      response = await makeRequest(newAccessToken);
    } else {
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export const fetchWithAuth = async (url, options = {}) => {
  const getHeaders = (token) => {
    const accessToken = token || sessionStorage.getItem("token");
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
    const accessToken = token || sessionStorage.getItem("token");
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  };
  return baseFetchWithAuth(url, options, getHeaders);
};
