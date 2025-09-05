import React, { useState, useEffect } from "react";
import { searchClients, createClient } from "../../services/client";
import styles from "../../styles/NewAppointmentModal.module.css";
import modalStyles from "../../styles/Modal.module.css"; // Import common modal styles
import { getDisplayNameForClient } from "./ClientUtils";
import ModeSwitcher from "./ModeSwitcher";
import AppointmentForm from "./AppointmentForm";
import ClientSearch from "./ClientSearch";
import AddClientForm from "./AddClientForm";
import { useTranslation } from "react-i18next";
import moment from "moment";

const NewAppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("search"); // 'search' or 'add'
  const { t } = useTranslation();

  // State for Search Client Mode
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // State for Add New Client Mode
  const [newClientFirstName, setNewClientFirstName] = useState("");
  const [newClientLastName, setNewClientLastName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhoneNumber, setNewClientPhoneNumber] = useState("");
  // Debounced search for clients
  useEffect(() => {
    if (mode === "search") {
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
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [clientSearchTerm, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalClientId = null;

    if (mode === "add") {
      if (!newClientFirstName || !newClientLastName || !newClientPhoneNumber) {
        // Removed alert as per user request
        return;
      }

      try {
        const createdAt = new Date().toISOString().split("T")[0];
        const newClientData = {
          firstName: newClientFirstName,
          lastName: newClientLastName,
          email: newClientEmail,
          phone: newClientPhoneNumber,
          createdAt: createdAt,
        };
        const createdClient = await createClient(newClientData);
        // Removed alert as per user request
        finalClientId = createdClient.id;

        setSelectedClient(createdClient);
        setClientSearchTerm(getDisplayNameForClient(createdClient));
        setMode("search");
      } catch (error) {
        console.error("Error creating new client:", error);
        // Removed alert as per user request
        return;
      }
    } else {
      if (!selectedClient) {
        // Removed alert as per user request
        return;
      }
      finalClientId = selectedClient.id;
    }

    if (!title || !start || !end || !finalClientId) {
      // Removed alert as per user request
      return;
    }

    await onSubmit({
      title,
      start: moment(start, "YYYY-MM-DDTHH:mm").utc().toISOString(),
      end: moment(end, "YYYY-MM-DDTHH:mm").utc().toISOString(),
      clientId: finalClientId,
    });
    onClose(); // Close the modal after submission
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearchTerm("");
    setFilteredClients([]);
  };

  if (!isOpen) return null; // Conditionally render

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <button className={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>New Appointment</h2>

        <ModeSwitcher mode={mode} setMode={setMode} />

        <form onSubmit={handleSubmit}>
          <AppointmentForm
            title={title}
            setTitle={setTitle}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
          />

          {mode === "search" ? (
            <ClientSearch
              clientSearchTerm={clientSearchTerm}
              setClientSearchTerm={setClientSearchTerm}
              setSelectedClient={setSelectedClient}
              filteredClients={filteredClients}
              handleClientSelect={handleClientSelect}
              selectedClient={selectedClient}
            />
          ) : (
            <AddClientForm
              newClientFirstName={newClientFirstName}
              setNewClientFirstName={setNewClientFirstName}
              newClientLastName={newClientLastName}
              setNewClientLastName={setNewClientLastName}
              newClientEmail={newClientEmail}
              setNewClientEmail={setNewClientEmail}
              newClientPhoneNumber={newClientPhoneNumber}
              setNewClientPhoneNumber={setNewClientPhoneNumber}
            />
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t("appointments.cancel")}
            </button>
            <button type="submit" className={styles.button}>
              {mode === "search"
                ? t("appointments.create_appointment")
                : t("appointments.create_client_appointment")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;