import React, { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  toggleTaskCompletion,
} from "../../services/task";
import { searchClients } from "../../services/client";
import styles from "../../styles/TodoApp.module.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [clients, setClients] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasksAndClients();
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (clientSearchTerm) {
        try {
          const results = await searchClients(clientSearchTerm);
          setFilteredClients(results);
        } catch (error) {
          console.error("Error searching clients:", error);
          setFilteredClients([]);
        }
      } else {
        setFilteredClients([]);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [clientSearchTerm]);

  const fetchTasksAndClients = async () => {
    try {
      setLoading(true);
      const [tasksData, clientsData] = await Promise.all([
        getTasks(),
        searchClients(""), // Initially load all or recent clients if desired
      ]);
      setTasks(tasksData);
      setClients(clientsData);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === "") return;

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription,
      clientId: newClientId || null,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : null,
    };

    try {
      const createdTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewClientId("");
      setNewDueDate("");
      setClientSearchTerm("");
      setSelectedClient(null);
    } catch (err) {
      setError("Failed to add task.");
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task.");
      console.error("Error deleting task:", err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const updatedTask = await toggleTaskCompletion(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError("Failed to toggle task completion.");
      console.error("Error toggling task completion:", err);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "N/A";
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setNewClientId(client.id);
    setClientSearchTerm("");
    setFilteredClients([]);
  };

  if (loading) {
    return <div className={styles.container}>Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Tasks</h2>
      <div className={styles.inputContainer}>
        <div className={styles.addTaskContainer}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task title"
            className={styles.taskInput}
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className={styles.taskInput}
            rows="3"
          ></textarea>
        </div>
        <div className={styles.clientSearchContainer}>
          <input
            type="text"
            value={clientSearchTerm}
            onChange={(e) => {
              setClientSearchTerm(e.target.value);
              setSelectedClient(null);
              setNewClientId("");
            }}
            placeholder="Search for a client..."
            className={`${styles.taskInput} ${styles.clientSearchInput}`}
          />
          {filteredClients.length > 0 && (
            <ul className={styles.clientList}>
              {filteredClients.map((client) => (
                <li key={client.id} onClick={() => handleClientSelect(client)}>
                  {client.firstName} {client.lastName}
                </li>
              ))}
            </ul>
          )}
          {selectedClient && (
            <div className={styles.selectedClient}>
              Selected: {selectedClient.firstName} {selectedClient.lastName}
            </div>
          )}
        </div>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className={styles.taskInput}
        />
        <button onClick={handleAddTask} className={styles.addButton}>
          Add Task
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className={styles.noTasks}>No tasks yet. Add one!</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`${styles.taskItem} ${
                task.isCompleted ? styles.completed : ""
              }`}
            >
              <div>
                <strong className={styles.taskTitle}>{task.title}</strong>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div className={styles.taskMeta}>
                  {task.clientId && (
                    <span className={styles.taskClient}>
                      Client: {getClientName(task.clientId)}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className={styles.taskDueDate}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.taskActions}>
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={styles.toggleButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"></path>
                    <polyline points="9 11 12 14 22 4"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={styles.deleteButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-trash-2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
