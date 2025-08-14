import React, { useState, useEffect } from "react";
import { searchClients, createClient } from "../../services/client";
import styles from "../../styles/NewAppointmentModal.module.css";
import { getDisplayNameForClient } from "./ClientUtils";
import ModeSwitcher from "./ModeSwitcher";
import AppointmentForm from "./AppointmentForm";
import ClientSearch from "./ClientSearch";
import AddClientForm from "./AddClientForm";
import { useTranslation } from "react-i18next";

const NewAppointmentModal = ({ onClose, onSubmit }) => {
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
  const [newClientDateOfBirth, setNewClientDateOfBirth] = useState("");
  const [newClientGender, setNewClientGender] = useState("");
  const [newClientHasCard, setNewClientHasCard] = useState(false);
  const [newClientNotes, setNewClientNotes] = useState("");

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
        alert("Full Name and Phone Number are required for new client.");
        return;
      }

      try {
        const createdAt = new Date().toISOString().split("T")[0];
        const newClientData = {
          firstName: newClientFirstName,
          lastName: newClientLastName,
          email: newClientEmail,
          phone: newClientPhoneNumber,
          dateOfBirth: newClientDateOfBirth,
          gender: newClientGender,
          hasCard: newClientHasCard,
          notes: newClientNotes,
          createdAt: createdAt,
        };
        const createdClient = await createClient(newClientData);
        alert("New client created successfully!");
        finalClientId = createdClient.id;

        setSelectedClient(createdClient);
        setClientSearchTerm(getDisplayNameForClient(createdClient));
        setMode("search");
      } catch (error) {
        console.error("Error creating new client:", error);
        alert("Failed to create new client. Please try again.");
        return;
      }
    } else {
      if (!selectedClient) {
        alert("Please select an existing client.");
        return;
      }
      finalClientId = selectedClient.id;
    }

    if (!title || !start || !end || !finalClientId) {
      alert(
        "Please fill in all appointment details and select/create a client."
      );
      return;
    }

    onSubmit({
      title,
      start,
      end,
      clientId: finalClientId,
    });
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearchTerm("");
    setFilteredClients([]);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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
              newClientDateOfBirth={newClientDateOfBirth}
              setNewClientDateOfBirth={setNewClientDateOfBirth}
              newClientGender={newClientGender}
              setNewClientGender={setNewClientGender}
              newClientHasCard={newClientHasCard}
              setNewClientHasCard={setNewClientHasCard}
              newClientNotes={newClientNotes}
              setNewClientNotes={setNewClientNotes}
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
