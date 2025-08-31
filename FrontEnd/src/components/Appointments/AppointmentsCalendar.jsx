import React, { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/el"; // Import Greek locale for moment
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../services/appointment";
import { getClientById } from "../../services/client"; // Import getClientById
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../../hooks/useTheme";
import NewAppointmentModal from "./NewAppointmentModal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import styles from "../../styles/AppointmentsCalendar.module.css";
import { useTranslation } from "react-i18next";

const AppointmentsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  // Memoize the localizer and other locale-dependent props to ensure they update
  // when the language changes. This is the key to solving the localization issue.
  const { localizer, messages, formats } = useMemo(() => {
    // Set the locale for moment before creating the localizer
    moment.locale(i18n.language);
    console.log("Current moment locale:", moment.locale());
    console.log("Available moment locales:", moment.locales());
    return {
      localizer: momentLocalizer(moment),
      messages: {
        today: t("calendar.today"),
        previous: t("calendar.previous"),
        next: t("calendar.next"),
        month: t("calendar.month"),
        week: t("calendar.week"),
        day: t("calendar.day"),
        agenda: t("calendar.agenda"),
        date: t("calendar.date"),
        time: t("calendar.time"),
        event: t("calendar.event"),
        allDay: t("calendar.allDay"),
        noEventsInRange: t("calendar.noEventsInRange"),
        showMore: (total) => `+${total} ${t("calendar.showMore")}`,
      },
      formats: {
        weekdayFormat: "ddd",
        monthHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, "MMMM YYYY", culture),
      },
    };
  }, [i18n.language, t]);

  const fetchAppointments = async () => {
    try {
      const appointments = await getAppointments();
      const formattedEvents = await Promise.all(
        appointments.map(async (appointment) => {
          let clientDetails = appointment.client;
          // If client details are not embedded, fetch them
          if (!clientDetails && appointment.clientId) {
            try {
              clientDetails = await getClientById(appointment.clientId);
            } catch (clientError) {
              console.error(
                `Error fetching client ${appointment.clientId}:`,
                clientError
              );
              clientDetails = null; // Set to null if fetching fails
            }
          }

          return {
            ...appointment,
            title: appointment.title, // Use the title as is
            start: moment.utc(appointment.start).local().toDate(),
            end: moment.utc(appointment.end).local().toDate(),
            client: clientDetails, // Ensure client details are attached
          };
        })
      );
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenNewAppointmentModal = () => setShowNewAppointmentModal(true);
  const handleCloseNewAppointmentModal = () =>
    setShowNewAppointmentModal(false);

  const handleNewAppointment = async (newAppointmentData) => {
    try {
      const createdAppointment = await createAppointment(newAppointmentData);
      // After creation, fetch the full client details for the newly created appointment
      let clientDetails = null;
      if (createdAppointment.clientId) {
        try {
          clientDetails = await getClientById(createdAppointment.clientId);
        } catch (clientError) {
          console.error(
            `Error fetching client ${createdAppointment.clientId} after creation:`,
            clientError
          );
        }
      }
      // Add the client details to the created appointment object
      const eventWithClient = {
        ...createdAppointment,
        start: moment.utc(createdAppointment.start).local().toDate(),
        end: moment.utc(createdAppointment.end).local().toDate(),
        client: clientDetails,
      };

      // Update events state with the new appointment including client details
      setEvents((prevEvents) => [...prevEvents, eventWithClient]);
      handleCloseNewAppointmentModal();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEvent(null);
  };

  const handleUpdateAppointment = async (appointmentId, updatedData) => {
    try {
      const updatedAppointment = await updateAppointment(
        appointmentId,
        updatedData
      );
      // After update, fetch the full client details for the updated appointment
      let clientDetails = null;
      if (updatedAppointment.clientId) {
        try {
          clientDetails = await getClientById(updatedAppointment.clientId);
        } catch (clientError) {
          console.error(
            `Error fetching client ${updatedAppointment.clientId} after update:`,
            clientError
          );
        }
      }
      // Update events state with the updated appointment including client details
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === appointmentId) {
            return {
              ...updatedAppointment,
              title: updatedAppointment.title, // Use the title as is
              start: moment.utc(updatedAppointment.start).local().toDate(),
              end: moment.utc(updatedAppointment.end).local().toDate(),
              client: clientDetails,
            };
          }
          return event;
        })
      );
      handleCloseDetailsModal();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      // Remove the deleted appointment from the events state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== appointmentId)
      );
      handleCloseDetailsModal();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <div
      className={`${theme === "dark" ? "dark-theme" : "light-theme"} ${
        styles.calendarContainer
      }`}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className={styles.calendar}
        onSelectEvent={handleSelectEvent}
        key={i18n.language} // Force a full re-render on language change
        culture={i18n.language} // Explicitly set the culture
        messages={messages}
        formats={formats}
      />
      <div className={styles.buttonContainer}>
        <button
          onClick={handleOpenNewAppointmentModal}
          className={styles.button}
        >
          {t("appointments.new_appointment")}
        </button>
      </div>

      {showNewAppointmentModal && (
        <NewAppointmentModal
          onClose={handleCloseNewAppointmentModal}
          onSubmit={handleNewAppointment}
        />
      )}

      {showDetailsModal && selectedEvent && (
        <AppointmentDetailsModal
          appointment={selectedEvent}
          onClose={handleCloseDetailsModal}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsCalendar;
