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

export const getAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create appointment");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete appointment with ID ${appointmentId}`);
    }
    return null;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

// New function to update an appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update appointment with ID ${appointmentId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

export const getAppointmentsByDate = async (date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/date/${date}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch appointments for date");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching appointments for date ${date}:`, error);
    throw error;
  }
};