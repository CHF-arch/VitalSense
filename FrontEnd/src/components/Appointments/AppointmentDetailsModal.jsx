import React, { useState, useEffect } from "react";
import { searchClients } from "../../services/client"; // Needed for client search in edit mode
import moment from "moment"; // Import moment for date formatting
import styles from "../../styles/AppointmentDetailsModal.module.css"; // Import styles
import { useTranslation } from "react-i18next";
import { getDisplayNameForClient } from "./ClientUtils";

const AppointmentDetailsModal = ({
  appointment,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(appointment.title || "");
  const { t } = useTranslation();
  const [start, setStart] = useState(
    appointment.start
      ? moment(appointment.start).format("YYYY-MM-DDTHH:mm")
      : ""
  );
  const [end, setEnd] = useState(
    appointment.end ? moment(appointment.end).format("YYYY-MM-DDTHH:mm") : ""
  );

  // For client search/selection in edit mode
  const [clientSearchTerm, setClientSearchTerm] = useState(
    getDisplayNameForClient(appointment.client)
  );
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(
    appointment.client || null
  ); // Stores { id, fullName, phoneNumber }

  // Debounced search for clients (only in edit mode)
  useEffect(() => {
    if (!isEditing) {
      // If not in edit mode, clear search results
      setFilteredClients([]);
      return;
    }

    if (clientSearchTerm) {
      const handler = setTimeout(async () => {
        try {
          const results = await searchClients(clientSearchTerm);
          console.log("DEBUG: Results from searchClients:", results); // Keep for now
          setFilteredClients(results);
        } catch (error) {
          console.error("Error searching clients in details modal:", error);
          setFilteredClients([]);
        }
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } else {
      // If clientSearchTerm is empty, clear search results
      setFilteredClients([]);
    }
  }, [clientSearchTerm, isEditing]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !start || !end || !selectedClient) {
      alert("Please fill in all fields and select a client.");
      return;
    }

    const updatedData = {
      ...appointment, // Keep existing properties
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      clientId: selectedClient.id,
    };
    onUpdate(appointment.id, updatedData);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      onDelete(appointment.id);
    }
  };

  const handleClientSelect = (client) => {
    console.log("Selected client:", client);
    setSelectedClient(client);
    setClientSearchTerm(getDisplayNameForClient(client));
    setFilteredClients([]);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {isEditing
            ? t("appointments.edit_appointment")
            : t("appointments.appointment_details")}
        </h2>

        {!isEditing ? (
          <div>
            <p className={styles.detailText}>
              <strong>{t("appointments.title")}:</strong> {appointment.title}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.start")}:</strong>{" "}
              {moment(appointment.start).format("LLL")}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.end")}:</strong>{" "}
              {moment(appointment.end).format("LLL")}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.client")}:</strong>{" "}
              {getDisplayNameForClient(appointment.client)}
            </p>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
              >
                {t("appointments.close")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                {t("appointments.edit")}
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className={styles.deleteButton}
              >
                {t("appointments.delete")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="editTitle" className={styles.inputLabel}>
                {t("appointments.title")}:
              </label>
              <input
                type="text"
                id="editTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="editStart" className={styles.inputLabel}>
                {t("appointments.start_time")}:
              </label>
              <input
                type="datetime-local"
                id="editStart"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="editEnd" className={styles.inputLabel}>
                {t("appointments.end_time")}:
              </label>
              <input
                type="datetime-local"
                id="editEnd"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={styles.textInput}
              />
            </div>

            {/* Client Search Input for Edit Mode */}
            <div className={`${styles.formGroup} ${styles.relativePosition}`}>
              <label htmlFor="editClientSearch" className={styles.inputLabel}>
                {t("appointments.search_client")}:
              </label>
              <input
                type="text"
                id="editClientSearch"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setSelectedClient(null); // Clear selected client on new search
                }}
                placeholder={t("appointments.search_client")}
                className={styles.textInput}
              />
              {filteredClients.length > 0 && (
                <ul className={styles.searchResultList}>
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className={styles.searchResultItem}
                    >
                      {getDisplayNameForClient(client)} -{" "}
                      {client.phoneNumber || "N/A"}
                    </li>
                  ))}
                </ul>
              )}
              {selectedClient && (
                <p className={styles.selectedClientText}>
                  {t("appointments.selected_client")}:{" "}
                  <strong>{getDisplayNameForClient(selectedClient)}</strong>
                </p>
              )}
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                {t("appointments.cancel")}
              </button>
              <button type="submit" className={styles.saveButton}>
                {t("appointments.save_changes")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
