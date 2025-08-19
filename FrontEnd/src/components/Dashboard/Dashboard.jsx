import React, { useState, useEffect } from "react";
import styles from "../../styles/Dashboard.module.css";
import TodoApp from "../TodoApp/TodoApp";
import { getAppointmentsByDate } from "../../services/appointment";
import { getDashboardData } from "../../services/dashboard";
import { getClientById } from "../../services/client"; // Import getClientById
import moment from "moment";
import ClientChangeChart from "./ClientChangeChart";
import { useTranslation } from "react-i18next";

// Helper function to get client's display name
const getDisplayNameForClient = (client) => {
  if (!client) return "N/A";
  if (client.fullName) return client.fullName;
  if (client.firstName && client.lastName)
    return `${client.firstName} ${client.lastName}`;
  if (client.firstName) return client.firstName;
  if (client.lastName) return client.lastName;
  return "N/A";
};

export default function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalClients: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    newClientsLastMonth: 0,
    newClientsChangePercentFormatted: "string",
  });

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const today = moment().format("YYYY-MM-DD");
        const appointments = await getAppointmentsByDate(today);

        const appointmentsWithClientNames = await Promise.all(
          appointments.map(async (appointment) => {
            let clientDetails = appointment.client;
            if (!clientDetails && appointment.clientId) {
              try {
                clientDetails = await getClientById(appointment.clientId);
              } catch (clientError) {
                console.error(
                  `Error fetching client ${appointment.clientId}:`,
                  clientError
                );
                clientDetails = null;
              }
            }
            const clientDisplayName = getDisplayNameForClient(clientDetails);
            return {
              ...appointment,
              clientName: clientDisplayName,
              title: `${appointment.title} - ${clientDisplayName}`,
            };
          })
        );
        setTodayAppointments(appointmentsWithClientNames);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
      }
    };

    const dashboardData = async () => {
      try {
        const metrics = await getDashboardData();
        setDashboardMetrics(metrics);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchTodayAppointments();
    dashboardData();
  }, []);
  const { t } = useTranslation();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.contentBox1}>
            <div className={styles.metricsContainer}>
              <div className={`${styles.metricCard} ${styles.metricCard1}`}>
                <div className={styles.metricValue}>
                  {dashboardMetrics.totalClients}
                </div>
                <div className={styles.metricLabel}>
                  {t("dashboard.total_clients")}
                </div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCard2}`}>
                <div className={styles.metricValue}>
                  {dashboardMetrics.activeClients}
                </div>
                <div className={styles.metricLabel}>
                  {t("dashboard.active_clients")}
                </div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCard3}`}>
                <div className={styles.metricValue}>
                  {dashboardMetrics.newClientsThisMonth}
                </div>
                <div className={styles.metricLabel}>
                  {t("dashboard.new_this_month")}
                </div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCard4}`}>
                <div className={styles.metricValue}>
                  {dashboardMetrics.newClientsLastMonth}
                </div>
                <div className={styles.metricLabel}>
                  {t("dashboard.new_last_month")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contentBox3}>
          <div className={styles.changeChartContainer}>
            <div className={`${styles.metricCard} ${styles.metricCard5}`}>
              <div className={styles.metricValue}>
                {dashboardMetrics.newClientsChangePercentFormatted}
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ClientChangeChart data={dashboardMetrics} />
            </div>
          </div>
          <div className={styles.topDiv}>
            <h2>{t("dashboard.today_appointments")}</h2>
            {todayAppointments.length > 0 ? (
              <ul className={styles.listContainer}>
                {todayAppointments.map((appointment) => (
                  <li key={appointment.id} className={styles.listItem}>
                    {appointment.title} at{" "}
                    {moment(appointment.start).format("HH:mm")}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("dashboard.no_appointments")}</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.sidebar}>
        <TodoApp />
      </div>
    </div>
  );
}
