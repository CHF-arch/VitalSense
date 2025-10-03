import {
  getAllClients,
  deleteClient,
  searchClients,
} from "../../services/client";
import {
  getMealPlansByClientId,
  deleteMealPlan,
} from "../../services/mealPlan";
import {
  getAppointments,
  deleteAppointment,
} from "../../services/appointment";
import { useEffect, useState, useCallback } from "react";
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
  const [knownTotalPages, setKnownTotalPages] = useState(1);
  const { t } = useTranslation();
  const { openConfirmationModal } = useModal();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      let fetchedClients;
      if (searchTerm) {
        fetchedClients = await searchClients(searchTerm, currentPage, PAGE_SIZE);
      } else {
        fetchedClients = await getAllClients(currentPage, PAGE_SIZE);
      }

      setClients(fetchedClients);

      if (fetchedClients.length > 0) {
        setKnownTotalPages(prevTotal => {
          if (currentPage === prevTotal) {
            return currentPage + 1;
          }
          return prevTotal;
        });
      } else {
        setKnownTotalPages(currentPage);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
      setKnownTotalPages(1);
    }
  }, [searchTerm]);

  const handleDelete = (clientId) => {
    openConfirmationModal(t("clientlist.delete_confirmation"), async () => {
      try {
        const mealPlans = await getMealPlansByClientId(clientId);
        for (const mealPlan of mealPlans) {
          await deleteMealPlan(mealPlan.id);
        }

        const allAppointments = await getAppointments();
        const clientAppointments = allAppointments.filter(
          (appointment) => appointment.clientId === clientId
        );
        for (const appointment of clientAppointments) {
          await deleteAppointment(appointment.id);
        }

        await deleteClient(clientId);

        fetchClients();
      } catch (error) {
        console.error("Error during client deletion process:", error);
      }
    });
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error.message}</div>
      </div>
    );
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
      {knownTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={knownTotalPages}
          onPageChange={handlePageChange}
        />
      )}
      {loading ? (
        <div className={styles.loading}>Loading clients...</div>
      ) : (
        <>
          {clients.length > 0 ? (
            <div className={styles.clientGrid}>
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState onClientAdded={fetchClients} />
          )}
        </>
      )}
      {knownTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={knownTotalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}