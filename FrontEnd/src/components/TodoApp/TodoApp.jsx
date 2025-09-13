import React, { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  toggleTaskCompletion,
} from "../../services/task";
import { getAllClients } from "../../services/client";
import styles from "../../styles/TodoApp.module.css";
import { useTranslation } from "react-i18next";
import AddTaskModal from "./AddTaskModal";
import { useModal } from "../../context/useModal";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"
  const { t } = useTranslation();
  const { openConfirmationModal } = useModal();

  useEffect(() => {
    fetchTasksAndClients();
  }, []);

  const fetchTasksAndClients = async () => {
    try {
      setLoading(true);
      const [tasksData, clientsData] = await Promise.all([
        getTasks(),
        getAllClients(),
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

  const handleAddTask = async (taskData) => {
    try {
      await createTask(taskData);
      fetchTasksAndClients(); // Refetch all data
    } catch (err) {
      setError("Failed to add task.");
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = (id) => {
    openConfirmationModal(t("todo.delete_confirmation"), async () => {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    });
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
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client ? `${client.firstName} ${client.lastName}` : "N/A";
  };

  if (loading) {
    return <div className={styles.container}>{t("todo.loading_tasks")}</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.isCompleted;
    }
    if (filter === "completed") {
      return task.isCompleted;
    }
    return true; // "all"
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("todo.my_tasks")}</h2>
      <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
        {t("todo.add_task")}
      </button>
      {isModalOpen && (
        <AddTaskModal
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className={styles.filterContainer}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.activeFilter : ""}
        >
          {t("todo.all_tasks")}
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter === "active" ? styles.activeFilter : ""}
        >
          {t("todo.active_tasks")}
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? styles.activeFilter : ""}
        >
          {t("todo.completed_tasks")}
        </button>
      </div>
      {filteredTasks.length === 0 ? (
        <p className={styles.noTasks}>{t("todo.no_tasks")}</p>
      ) : (
        <ul className={styles.taskList}>
          {filteredTasks.map((task) => (
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
                    <div>
                      <span className={styles.taskDueDate}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
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
