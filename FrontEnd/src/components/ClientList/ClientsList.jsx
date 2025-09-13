import { getAllClients, deleteClient } from "../../services/client";
import {
  getMealPlansByClientId,
  deleteMealPlan,
} from "../../services/mealPlan";
import {
  getAppointments,
  deleteAppointment,
} from "../../services/appointment";
import { useEffect, useState } from "react";
import styles from "../../styles/ClientsList.module.css";
import * as XLSX from "xlsx";
import Toolbar from "./Toolbar";
import ClientCard from "./ClientCard";
import EmptyState from "./EmptyState";
import Pagination from "../common/Pagination";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal";

const PAGE_SIZE = 12;

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const { openConfirmationModal } = useModal();

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

  const handleDelete = (clientId) => {
    openConfirmationModal(t("clientlist.delete_confirmation"), async () => {
      try {
        // THIS IS NOT A ROBUST SOLUTION.
        // This logic should be handled on the backend to ensure data integrity.
        // If any of these requests fail, the data will be in an inconsistent state.
        // A backend transaction is the correct way to handle this.

        // 1. Fetch and delete meal plans
        const mealPlans = await getMealPlansByClientId(clientId);
        for (const mealPlan of mealPlans) {
          await deleteMealPlan(mealPlan.id);
        }

        // 2. Fetch and delete appointments
        // Inefficient: fetching all appointments and filtering on the client.
        // This should be a backend endpoint: GET /appointments?clientId=...
        const allAppointments = await getAppointments();
        const clientAppointments = allAppointments.filter(
          (appointment) => appointment.clientId === clientId
        );
        for (const appointment of clientAppointments) {
          await deleteAppointment(appointment.id);
        }

        // 3. Delete the client
        await deleteClient(clientId);

        setClients(clients.filter((client) => client.id !== clientId));
      } catch (error) {
        console.error("Error during client deletion process:", error);
        // Optionally, show an error message to the user
      }
    });
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
