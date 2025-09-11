import { getAllClients, deleteClient } from "../../services/client";
import { useEffect, useState } from "react";
import styles from "../../styles/ClientsList.module.css";
import * as XLSX from "xlsx";
import Toolbar from "./Toolbar";
import ClientCard from "./ClientCard";
import EmptyState from "./EmptyState";
import Pagination from "../common/Pagination";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 12;

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const fetchClients = async () => {
    try {
      const data = await getAllClients();
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setClients(sortedData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (clientId) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    // Normalize phone numbers by removing non-numeric characters
    const normalizedClientPhone = String(client.phone || "").replace(/\D/g, "");
    const normalizedSearchTerm = searchTerm.replace(/\D/g, "");

    // Check if the search term is purely numeric
    const isNumericSearch = /^\d+$/.test(searchTerm);

    if (isNumericSearch) {
      return normalizedClientPhone.includes(normalizedSearchTerm);
    } else {
      return fullName.includes(searchTermLower);
    }
  });

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        onClientAdded={fetchClients}
      />
      <div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className={styles.clientGrid}>
        {paginatedClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
