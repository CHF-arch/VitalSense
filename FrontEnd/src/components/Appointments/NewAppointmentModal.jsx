import React, { useState, useEffect } from "react";
import { searchClients, createClient } from "../../services/client"; // Import createClient service
import styles from "../../styles/NewAppointmentModal.module.css"; // Import styles

// Helper function to get client's display name
const getDisplayNameForClient = (client) => {
  if (!client) {
    return "N/A";
  }
  if (typeof client.fullName === "string" && client.fullName.trim() !== "") {
    return client.fullName;
  }
  const firstName =
    typeof client.firstName === "string" ? client.firstName.trim() : "";
  const lastName =
    typeof client.lastName === "string" ? client.lastName.trim() : "";

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return "N/A";
};

const NewAppointmentModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("search"); // 'search' or 'add'

  // State for Search Client Mode
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // Stores { id, fullName, phoneNumber }

  // State for Add New Client Mode (from AddClient.jsx)
  const [newClientFirstName, setNewClientFirstName] = useState("");
  const [newClientLastName, setNewClientLastName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhoneNumber, setNewClientPhoneNumber] = useState("");
  const [newClientDateOfBirth, setNewClientDateOfBirth] = useState("");
  const [newClientGender, setNewClientGender] = useState("");
  const [newClientHasCard, setNewClientHasCard] = useState(false);
  const [newClientNotes, setNewClientNotes] = useState("");

  // Debounced search for clients (only in search mode)
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
      }, 300); // 300ms debounce

      return () => {
        clearTimeout(handler);
      };
    }
  }, [clientSearchTerm, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalClientId = null;

    if (mode === "add") {
      // Validate new client inputs
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

        // Optionally, pre-select the newly created client for the appointment
        setSelectedClient(createdClient);
        setClientSearchTerm(getDisplayNameForClient(createdClient)); // Assuming fullName is returned
        setMode("search"); // Switch back to search mode after creating client
      } catch (error) {
        console.error("Error creating new client:", error);
        alert("Failed to create new client. Please try again.");
        return; // Stop submission if client creation fails
      }
    } else {
      // mode === 'search'
      if (!selectedClient) {
        alert("Please select an existing client.");
        return;
      }
      finalClientId = selectedClient.id;
    }

    // Proceed with appointment creation
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
    setFilteredClients([]); // Clear search results
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--background-color-secondary)",
          padding: "30px",
          borderRadius: "10px",
          width: "450px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-color-medium)",
          color: "var(--text-color-primary)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            textAlign: "center",
            color: "var(--text-color-primary)",
          }}
        >
          New Appointment
        </h2>

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => setMode("search")}
            style={{
              padding: "8px 15px",
              marginRight: "10px",
              backgroundColor:
                mode === "search"
                  ? "var(--gradient-blue-start)"
                  : "var(--border-color-medium)",
              color: mode === "search" ? "white" : "var(--text-color-primary)",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Search Existing Client
          </button>
          <button
            type="button"
            onClick={() => setMode("add")}
            style={{
              padding: "8px 15px",
              backgroundColor:
                mode === "add"
                  ? "var(--gradient-blue-start)"
                  : "var(--border-color-medium)",
              color: mode === "add" ? "white" : "var(--text-color-primary)",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Add New Client
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid var(--border-color-medium)",
                backgroundColor: "var(--input-background)",
                color: "var(--text-color-primary)",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="start"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Start Time:
            </label>
            <input
              type="datetime-local"
              id="start"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid var(--border-color-medium)",
                backgroundColor: "var(--input-background)",
                color: "var(--text-color-primary)",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="end"
              style={{ display: "block", marginBottom: "5px" }}
            >
              End Time:
            </label>
            <input
              type="datetime-local"
              id="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid var(--border-color-medium)",
                backgroundColor: "var(--input-background)",
                color: "var(--text-color-primary)",
              }}
            />
          </div>

          {mode === "search" ? (
            /* Client Search Input */
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label
                htmlFor="clientSearch"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Search Client (Name or Phone):
              </label>
              <input
                type="text"
                id="clientSearch"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setSelectedClient(null); // Clear selected client on new search
                }}
                placeholder="Enter client name or phone number"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid var(--border-color-medium)",
                  backgroundColor: "var(--input-background)",
                  color: "var(--text-color-primary)",
                }}
              />
              {filteredClients.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "var(--background-color-secondary)",
                    border: "1px solid var(--border-color-medium)",
                    borderRadius: "5px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    listStyle: "none",
                    padding: "0",
                    margin: "5px 0 0 0",
                    zIndex: 1001,
                  }}
                >
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color-light)",
                        color: "var(--text-color-primary)",
                      }}
                    >
                      {getDisplayNameForClient(client)}
                    </li>
                  ))}
                </ul>
              )}
              {selectedClient && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "var(--text-color-secondary)",
                  }}
                >
                  Selected Client:{" "}
                  <strong>{getDisplayNameForClient(selectedClient)}</strong>
                </p>
              )}
            </div>
          ) : (
            /* Add New Client Inputs */
            <div>
              <h3
                style={{
                  marginBottom: "15px",
                  color: "var(--text-color-primary)",
                }}
              >
                New Client Details
              </h3>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientFirstName"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  First Name:
                </label>
                <input
                  type="text"
                  id="newClientFirstName"
                  value={newClientFirstName}
                  onChange={(e) => setNewClientFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientLastName"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  id="newClientLastName"
                  value={newClientLastName}
                  onChange={(e) => setNewClientLastName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientPhoneNumber"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="newClientPhoneNumber"
                  value={newClientPhoneNumber}
                  onChange={(e) => setNewClientPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientEmail"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Email (Optional):
                </label>
                <input
                  type="email"
                  id="newClientEmail"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientDateOfBirth"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Date of Birth (Optional):
                </label>
                <input
                  type="date"
                  id="newClientDateOfBirth"
                  value={newClientDateOfBirth || ""}
                  onChange={(e) => setNewClientDateOfBirth(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientGender"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Gender (Optional):
                </label>
                <select
                  id="newClientGender"
                  value={newClientGender}
                  onChange={(e) => setNewClientGender(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="newClientHasCard"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <input
                    type="checkbox"
                    id="newClientHasCard"
                    checked={newClientHasCard}
                    onChange={(e) => setNewClientHasCard(e.target.checked)}
                    style={{ marginRight: "5px" }}
                  />
                  Has Card
                </label>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="newClientNotes"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Notes (Optional):
                </label>
                <textarea
                  id="newClientNotes"
                  value={newClientNotes}
                  onChange={(e) => setNewClientNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--border-color-medium)",
                    backgroundColor: "var(--input-background)",
                    color: "var(--text-color-primary)",
                  }}
                  rows="3"
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.button}>
              {mode === "search"
                ? "Create Appointment"
                : "Create Client & Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
