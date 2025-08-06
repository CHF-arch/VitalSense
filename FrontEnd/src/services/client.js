import { API_BASE_URL } from "../config/api";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
};

export async function getAllClients() {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
export async function getClientById(clientId) {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch client with ID ${clientId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
}
export async function createClient(clientData) {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error("Failed to create client");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}
