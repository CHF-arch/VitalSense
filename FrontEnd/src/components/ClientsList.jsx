import { getAllClients, updateClient, deleteClient } from "../services/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ClientsList.module.css";
import * as XLSX from "xlsx";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedClientData, setEditedClientData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEdit = (client) => {
    setEditingClientId(client.id);
    setEditedClientData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth.split("T")[0], // Format for input type date
      gender: client.gender,
      hascard: client.hascard,
      notes: client.notes,
    });
  };

  const handleCancel = () => {
    setEditingClientId(null);
  };

  const handleSave = async (clientId) => {
    try {
      const clientToUpdate = clients.find((client) => client.id === clientId);
      const updatedData = { ...clientToUpdate, ...editedClientData };
      await updateClient(clientId, updatedData);
      setClients(
        clients.map((client) => (client.id === clientId ? updatedData : client))
      );
      setEditingClientId(null);
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedClientData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (clients.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>No clients found.</h1>
        <Link to="/add-client" className={styles.addButton}>
          Add Client
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Customer List</h1>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleExport} className={styles.exportButton}>
          Export to Excel
        </button>
        <Link to="/add-client" className={styles.addButton}>
          Add Client
        </Link>
      </div>
      <ul className={styles.clientList}>
        {filteredClients.map((client) => (
          <li key={client.id} className={styles.clientItem}>
            {editingClientId === client.id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  name="firstName"
                  value={editedClientData.firstName}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="lastName"
                  value={editedClientData.lastName}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <input
                  type="email"
                  name="email"
                  value={editedClientData.email}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="phone"
                  value={editedClientData.phone}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editedClientData.dateOfBirth}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="gender"
                  value={editedClientData.gender}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="hascard"
                    checked={editedClientData.hascard}
                    onChange={handleInputChange}
                  />
                  Has Card
                </label>
                <textarea
                  name="notes"
                  value={editedClientData.notes}
                  onChange={handleInputChange}
                  className={styles.textareaField}
                />
                <div className={styles.actions}>
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSave(client.id)}
                  >
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className={styles.clientName}>
                  {client.firstName} {client.lastName}
                </span>
                <div className={styles.clientDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email: </span>
                    {client.email}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone: </span>
                    {client.phone}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date of Birth: </span>
                    {new Date(client.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Gender: </span>
                    {client.gender}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Card: </span>
                    {client.hasCard ? "Yes" : "No"}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Joined: </span>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {client.notes && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Notes: </span>
                    {client.notes}
                  </div>
                )}
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(client)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(client.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
