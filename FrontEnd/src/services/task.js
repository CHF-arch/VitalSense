import { API_BASE_URL } from "../config/api";
import { fetchWithAuth } from "./api";

export const getTasks = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete task with ID ${taskId}`);
    }
    // No content expected for successful delete
    return null;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (taskId) => {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/tasks/${taskId}/toggle`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to toggle task completion.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};
