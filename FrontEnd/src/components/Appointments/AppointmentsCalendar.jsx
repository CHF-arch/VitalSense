import React, { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/el"; // Import Greek locale for moment
import {
  updateAppointment,
  deleteAppointment,
  getAppointmentsFrom,
} from "../../services/appointment";
import { getClientById } from "../../services/client"; // Import getClientById
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../../hooks/useTheme";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import styles from "../../styles/AppointmentsCalendar.module.css";
import { useTranslation } from "react-i18next";
import NewAppointmentButton from "./NewAppointmentButton";
import { SyncAllFeaturesAppointments } from "../../services/google";
import { toast } from "react-toastify";
import { useModal } from "../../context/useModal";

const AppointmentsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { openNewAppointmentModal } = useModal();
  const { localizer, messages, formats } = useMemo(() => {
    moment.locale(i18n.language);

    const loc = momentLocalizer(moment);

    return {
      localizer: loc,
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
        weekdayFormat: (date) => {
          const day = date.getDay();
          const days = {
            0: t("calendar.sunday"),
            1: t("calendar.monday"),
            2: t("calendar.tuesday"),
            3: t("calendar.wednesday"),
            4: t("calendar.thursday"),
            5: t("calendar.friday"),
            6: t("calendar.saturday"),
          };
          return days[day].substring(0, 3);
        },
        monthHeaderFormat: (date) => {
          const month = date.getMonth();
          const months = [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος",
          ];
          return `${
            i18n.language === "el" ? months[month] : moment(date).format("MMMM")
          } ${date.getFullYear()}`;
        },
        dayFormat: (date) => {
          const dayNum = date.getDate();
          const dayOfWeek = date.getDay();
          const days = {
            0: t("calendar.sunday"),
            1: t("calendar.monday"),
            2: t("calendar.tuesday"),
            3: t("calendar.wednesday"),
            4: t("calendar.thursday"),
            5: t("calendar.friday"),
            6: t("calendar.saturday"),
          };
          const dayName = days[dayOfWeek].substring(0, 3);
          return `${dayNum} ${dayName}`;
        },
        dayHeaderFormat: (date) => {
          const month = date.getMonth();
          const months = [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος",
          ];
          const daysOfWeek = [
            t("calendar.sunday"),
            t("calendar.monday"),
            t("calendar.tuesday"),
            t("calendar.wednesday"),
            t("calendar.thursday"),
            t("calendar.friday"),
            t("calendar.saturday"),
          ];
          if (i18n.language === "el") {
            const dayOfWeekIndex = date.getDay();
            const dayOfMonth = moment(date).format("D");
            return `${daysOfWeek[dayOfWeekIndex]} ${dayOfMonth} ${months[month]}`;
          }
          return moment(date).locale(i18n.language).format("dddd DD MMMM");
        },
        dayRangeHeaderFormat: ({ start, end }) => {
          const startMonthIndex = start.getMonth();
          const endMonthIndex = end.getMonth();
          const months = [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος",
          ];
          if (i18n.language === "el") {
            const startDay = moment(start).format("D");
            const endDay = moment(end).format("D");
            if (startMonthIndex === endMonthIndex) {
              return `${startDay} – ${endDay} ${months[startMonthIndex]}`;
            }
            return `${startDay} ${months[startMonthIndex]} – ${endDay} ${months[endMonthIndex]}`;
          }
          return `${moment(start)
            .locale(i18n.language)
            .format("DD MMMM")} – ${moment(end)
            .locale(i18n.language)
            .format("DD MMMM")}`;
        },
      },
    };
  }, [i18n.language, t]);

  const fetchAppointmentsFrom = async (from, to) => {
    try {
      const appointments = await getAppointmentsFrom(from, to);
      const formattedEvents = await Promise.all(
        appointments.map(async (appointment) => {
          return {
            ...appointment,
            title: `${appointment.title}`,
            start: moment.utc(appointment.start).local().toDate(),
            end: moment.utc(appointment.end).local().toDate(),
            clientFirstName: appointment.clientFirstName,
            clientLastName: appointment.clientLastName,
          };
        })
      );
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");
    fetchAppointmentsFrom(startOfWeek, endOfWeek);
  }, []);

  const handleNewAppointment = (createdAppointment) => {
    const eventWithClient = {
      ...createdAppointment,
      start: moment.utc(createdAppointment.start).local().toDate(),
      end: moment.utc(createdAppointment.end).local().toDate(),
    };
    setEvents((prevEvents) => [...prevEvents, eventWithClient]);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleSelectSlot = (slotInfo) => {
    openNewAppointmentModal(handleNewAppointment, {
      start: slotInfo.start,
      end: slotInfo.end,
    });
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
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === appointmentId) {
            return {
              ...updatedAppointment,
              title: updatedAppointment.title,
              start: moment.utc(updatedAppointment.start).local().toDate(),
              end: moment.utc(updatedAppointment.end).local().toDate(),
              client: clientDetails,
            };
          }
          return event;
        })
      );
      handleCloseDetailsModal();
      toast.success(t("toast.appointmentEditSuccess"));
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(t("toast.errorOccurred"));
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== appointmentId)
      );
      handleCloseDetailsModal();
      toast.success(t("toast.appointmentDeleteSuccess"));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(t("toast.errorOccurred"));
    }
  };

  const handleRangeChange = (range) => {
    let start, end;

    if (Array.isArray(range)) {
      start = moment(range[0]).format("YYYY-MM-DD");
      end = moment(range[range.length - 1]).format("YYYY-MM-DD");
    } else {
      start = moment(range.start).format("YYYY-MM-DD");
      end = moment(range.end).format("YYYY-MM-DD");
    }

    fetchAppointmentsFrom(start, end);
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const SyncAppointments = async () => {
    setIsSyncing(true);
    try {
      await SyncAllFeaturesAppointments();
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
      await fetchAppointmentsFrom(startOfMonth, endOfMonth);
      toast.success(t("appointments.update_synced_suc"));
    } catch (error) {
      console.error("Error syncing appointments:", error);
      toast.error(t("toast.errorOccurred"));
    } finally {
      setIsSyncing(false);
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
        onSelectSlot={handleSelectSlot}
        selectable
        key={i18n.language} // Force a full re-render on language change
        culture={i18n.language} // Explicitly set the culture
        messages={messages}
        formats={formats}
        onRangeChange={handleRangeChange}
        min={new Date(0, 0, 0, 7, 0, 0)}
        defaultView="week"
        style={{ width: "95%" }}
        views={["month", "week", "day"]}
      />
      <div className={styles.buttonContainer}>
        <NewAppointmentButton onSuccess={handleNewAppointment} />
        <button
          className={styles.buttonSync}
          onClick={SyncAppointments}
          disabled={isSyncing}
        >
          {isSyncing ? t("appointments.syncing") : t("appointments.sync")}
        </button>
      </div>

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
