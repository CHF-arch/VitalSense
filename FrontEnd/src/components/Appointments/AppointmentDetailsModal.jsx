import React, { useState, useEffect } from "react";
import { searchClients } from "../../services/client"; // Needed for client search in edit mode
import moment from "moment"; // Import moment for date formatting
import styles from "../../styles/AppointmentDetailsModal.module.css"; // Import styles

// Helper function to get client's display name
const getDisplayNameForClient = (client) => {
  if (!client) {
    return "N/A";
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

  // Fallback to fullName if firstName/lastName are not sufficient
  if (typeof client.fullName === "string" && client.fullName.trim() !== "") {
    return client.fullName;
  }

  return "N/A";
};

const AppointmentDetailsModal = ({
  appointment,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(appointment.title || "");
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
    if (!isEditing) { // If not in edit mode, clear search results
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
    } else { // If clientSearchTerm is empty, clear search results
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
          {isEditing ? "Edit Appointment" : "Appointment Details"}
        </h2>

        {!isEditing ? (
          <div>
            <p>
              <strong>Title:</strong> {appointment.title}
            </p>
            <p>
              <strong>Start:</strong> {moment(appointment.start).format("LLL")}
            </p>
            <p>
              <strong>End:</strong> {moment(appointment.end).format("LLL")}
            </p>
            <p>
              <strong>Client:</strong>{" "}
              {getDisplayNameForClient(appointment.client)}
            </p>
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
                className={styles.closeButton}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="editTitle"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Title:
              </label>
              <input
                type="text"
                id="editTitle"
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
                htmlFor="editStart"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Start Time:
              </label>
              <input
                type="datetime-local"
                id="editStart"
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
                htmlFor="editEnd"
                style={{ display: "block", marginBottom: "5px" }}
              >
                End Time:
              </label>
              <input
                type="datetime-local"
                id="editEnd"
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

            {/* Client Search Input for Edit Mode */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label
                htmlFor="editClientSearch"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Search Client (Name or Phone):
              </label>
              <input
                type="text"
                id="editClientSearch"
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
                      {getDisplayNameForClient(client)} -{" "}
                      {client.phoneNumber || "N/A"}
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "var(--border-color-medium)",
                  color: "var(--text-color-primary)",
                  border: "none",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "var(--gradient-blue-start)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
