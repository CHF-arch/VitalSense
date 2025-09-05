import React, { useState, useEffect } from "react";
import styles from "../../styles/AddTaskModal.module.css";
import { useTranslation } from "react-i18next";
import { searchClients } from "../../services/client";

export default function AddTaskModal({ onAddTask, onClose }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const { t } = useTranslation();

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

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setNewClientId(client.id);
    setClientSearchTerm("");
    setFilteredClients([]);
  };

  const handleSubmit = () => {
    if (newTaskTitle.trim() === "") return;

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription,
      clientId: newClientId || null,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : null,
    };
    onAddTask(taskData);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{t("todo.add_new_task")}</h2>
        <div className={styles.inputContainer}>
          <div className={styles.addTaskContainer}>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={t("todo.add_new_task_title")}
              className={styles.taskInput}
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder={t("todo.add_new_task_description")}
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
              placeholder={t("todo.search_client")}
              className={`${styles.taskInput} ${styles.clientSearchInput}`}
              disabled={!!selectedClient}
            />
            {filteredClients.length > 0 && (
              <ul className={styles.clientList}>
                {filteredClients.map((client) => (
                  <li
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                  >
                    {client.firstName} {client.lastName}
                  </li>
                ))}
              </ul>
            )}
            {selectedClient && (
              <div className={styles.selectedClient}>
                <span>
                  {t("todo.selected_client")}: {selectedClient.firstName}{" "}
                  {selectedClient.lastName}
                </span>
                <button
                  className={styles.clearButton}
                  onClick={() => {
                    setSelectedClient(null);
                    setNewClientId("");
                    setClientSearchTerm("");
                  }}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className={styles.taskInput}
          />
        </div>
        <div className={styles.modalActions}>
          <button onClick={handleSubmit} className={styles.addButton}>
            {t("todo.add_task")}
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
