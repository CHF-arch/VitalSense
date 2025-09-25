import React, { useState, useEffect } from "react";
import { searchClients } from "../../services/client";
import styles from "../../styles/AppointmentDetailsModal.module.css";
import { useTranslation } from "react-i18next";
import { getDisplayNameForClient } from "./ClientUtils";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import { el } from "date-fns/locale/el";
import { enUS } from "date-fns/locale/en-US";
import { useModal } from "../../context/useModal";

registerLocale("el", el);
registerLocale("en", enUS);

const AppointmentDetailsModal = ({
  appointment,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const { openConfirmationModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const clientFromAppointment = appointment.client || {
    id: appointment.clientId, // add id fallback
    firstName: appointment.clientFirstName,
    lastName: appointment.clientLastName,
  };

  const [title, setTitle] = useState(() => {
    if (appointment.title && clientFromAppointment) {
      const clientDisplayName = getDisplayNameForClient(clientFromAppointment);
      const regex = new RegExp(` - ${clientDisplayName}`);
      if (regex.test(appointment.title)) {
        return appointment.title.replace(regex, "");
      }
    }
    return appointment.title || "";
  });
  const { t, i18n } = useTranslation();
  const [start, setStart] = useState(
    appointment.start
      ? moment.utc(appointment.start).local().format("YYYY-MM-DDTHH:mm")
      : ""
  );
  const [end, setEnd] = useState(
    appointment.end
      ? moment.utc(appointment.end).local().format("YYYY-MM-DDTHH:mm")
      : ""
  );

  const [clientSearchTerm, setClientSearchTerm] = useState(
    getDisplayNameForClient(clientFromAppointment)
  );
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(
    clientFromAppointment || null
  );

  useEffect(() => {
    if (!isEditing) {
      setFilteredClients([]);
      return;
    }

    if (clientSearchTerm) {
      const handler = setTimeout(async () => {
        try {
          const results = await searchClients(clientSearchTerm);
          console.log("DEBUG: Results from searchClients:", results);
          setFilteredClients(results);
        } catch (error) {
          console.error("Error searching clients in details modal:", error);
          setFilteredClients([]);
        }
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setFilteredClients([]);
    }
  }, [clientSearchTerm, isEditing]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const effectiveClientId = selectedClient?.id ?? appointment.clientId;
    if (!title || !start || !end || !effectiveClientId) {
      return;
    }

    const updatedData = {
      ...appointment,
      title,
      start: moment(start, "YYYY-MM-DDTHH:mm").utc().toISOString(),
      end: moment(end, "YYYY-MM-DDTHH:mm").utc().toISOString(),
      clientId: effectiveClientId, // use fallback id if needed
    };
    await onUpdate(appointment.id, updatedData);
    window.location.reload();
  };

  const handleDeleteClick = () => {
    openConfirmationModal(t("appointments.delete_confirmation"), () =>
      onDelete(appointment.id)
    );
  };

  const handleClientSelect = (client) => {
    console.log("Selected client:", client);
    setSelectedClient(client);
    setClientSearchTerm(getDisplayNameForClient(client));
    setFilteredClients([]);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {isEditing
            ? t("appointments.edit_appointment")
            : t("appointments.appointment_details")}
        </h2>

        {!isEditing ? (
          <div>
            <p className={styles.detailText}>
              <strong>{t("appointments.title")}:</strong> {appointment.title}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.start")}:</strong>{" "}
              {moment
                .utc(appointment.start)
                .local()
                .format("DD-MM-YYYY hh:mm A")}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.end")}:</strong>{" "}
              {moment.utc(appointment.end).local().format("DD-MM-YYYY hh:mm A")}
            </p>
            <p className={styles.detailText}>
              <strong>{t("appointments.client")}:</strong>{" "}
              {getDisplayNameForClient(clientFromAppointment)}
            </p>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
              >
                {t("appointments.close")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                {t("appointments.edit")}
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className={styles.deleteButton}
              >
                {t("appointments.delete")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="editTitle" className={styles.inputLabel}>
                {t("appointments.title")}:
              </label>
              <input
                type="text"
                id="editTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="editStart" className={styles.inputLabel}>
                {t("appointments.start")}:
              </label>
              <DatePicker
                selected={start ? moment(start).toDate() : null}
                onChange={(date) =>
                  setStart(moment(date).format("YYYY-MM-DDTHH:mm"))
                }
                showTimeSelect
                dateFormat="dd-MM-yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption={t("appointments.time")}
                className={styles.textInput}
                locale={i18n.language}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="editEnd" className={styles.inputLabel}>
                {t("appointments.end")}:
              </label>
              <DatePicker
                selected={end ? moment(end).toDate() : null}
                onChange={(date) =>
                  setEnd(moment(date).format("YYYY-MM-DDTHH:mm"))
                }
                showTimeSelect
                dateFormat="dd-MM-yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption={t("appointments.time")}
                className={styles.textInput}
                locale={i18n.language}
              />
            </div>

            {/* Client Search Input for Edit Mode */}
            <div className={`${styles.formGroup} ${styles.relativePosition}`}>
              <label htmlFor="editClientSearch" className={styles.inputLabel}>
                {t("appointments.search_client")}:
              </label>
              <input
                type="text"
                id="editClientSearch"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setSelectedClient(null); // Clear selected client on new search
                }}
                placeholder={t("appointments.search_client")}
                className={styles.textInput}
              />
              {filteredClients.length > 0 && (
                <ul className={styles.searchResultList}>
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className={styles.searchResultItem}
                    >
                      {getDisplayNameForClient(client)} -{" "}
                      {client.phoneNumber || "N/A"}
                    </li>
                  ))}
                </ul>
              )}
              {selectedClient && (
                <p className={styles.selectedClientText}>
                  {t("appointments.selected_client")}:{" "}
                  <strong>{getDisplayNameForClient(selectedClient)}</strong>
                </p>
              )}
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                {t("appointments.cancel")}
              </button>
              <button type="submit" className={styles.saveButton}>
                {t("appointments.save_changes")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
