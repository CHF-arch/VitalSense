import {
  getAllClients,
  updateClient,
  deleteClient,
} from "../../services/client";
import { useEffect, useState } from "react";
import styles from "../../styles/ClientsList.module.css";
import * as XLSX from "xlsx";
import Toolbar from "./Toolbar";
import ClientCard from "./ClientCard";
import EmptyState from "./EmptyState";
import { useTranslation } from "react-i18next";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedClientData, setEditedClientData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

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
      dateOfBirth: client.dateOfBirth.split("T")[0],
      gender: client.gender,
      hasCard: client.hasCard,
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
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error.message}</div>
      </div>
    );
  }

  if (clients.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>{t("clientlist.client_directory")}</h1>
      <Toolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleExport={handleExport}
      />
      <div className={styles.clientGrid}>
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            editingClientId={editingClientId}
            editedClientData={editedClientData}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}
