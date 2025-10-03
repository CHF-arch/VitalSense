import { API_BASE_URL } from "../config/api";
import { fetchWithAuth, fetchWithAuthForFormData } from "./api";

export async function getAllClients(pageNumber, pageSize) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/clients?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
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
    const response = await fetchWithAuth(`${API_BASE_URL}/clients/${clientId}`);
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
    const response = await fetchWithAuth(`${API_BASE_URL}/clients`, {
      method: "POST",
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

export async function updateClient(clientId, clientData) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/clients/${clientId}`,
      {
        method: "PUT",
        body: JSON.stringify(clientData),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to update client with ID ${clientId}`);
    }
    if (response.status === 204) {
      return null; // No content to parse
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

export async function deleteClient(clientId) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/clients/${clientId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete client with ID ${clientId}`);
    }
    if (response.status === 204) {
      return null; // No content to parse
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

// New function to search clients
export async function searchClients(searchTerm) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/clients/search?q=${encodeURIComponent(
        searchTerm
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to search clients");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching clients:", error);
    throw error;
  }
}

export async function importClientsFromExcel(file) {
  try {
    const formData = new FormData();
    formData.append("excelFile", file);
    const response = await fetchWithAuthForFormData(`${API_BASE_URL}/clients/import`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to import clients from Excel");
    }
    return await response.json();
  } catch (error) {
    console.error("Error importing clients from Excel:", error);
    throw error;
  }
  
}