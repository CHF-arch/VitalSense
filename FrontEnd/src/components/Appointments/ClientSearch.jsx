// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/ClientSearch.jsx
import React from "react";
import { getDisplayNameForClient } from "./ClientUtils";
import styles from "../../styles/ClientSearch.module.css";
import { useTranslation } from "react-i18next";

const ClientSearch = ({
  clientSearchTerm,
  setClientSearchTerm,
  setSelectedClient,
  filteredClients,
  handleClientSelect,
  selectedClient,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.searchContainer}>
      <label htmlFor="clientSearch" className={styles.searchLabel}>
        {t("appointments.search_client")}:
      </label>
      <input
        type="text"
        id="clientSearch"
        value={clientSearchTerm}
        onChange={(e) => {
          setClientSearchTerm(e.target.value);
          setSelectedClient(null); // Clear selected client on new search
        }}
        placeholder={t("appointments.search_client")}
        className={styles.searchInput}
      />
      {filteredClients.length > 0 && (
        <ul className={styles.resultsList}>
          {filteredClients.map((client) => (
            <li
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className={styles.resultItem}
            >
              {getDisplayNameForClient(client)}
            </li>
          ))}
        </ul>
      )}
      {selectedClient && (
        <p className={styles.selectedClient}>
          {t("appointments.selected_client")}:{" "}
          <strong>{getDisplayNameForClient(selectedClient)}</strong>
        </p>
      )}
    </div>
  );
};

export default ClientSearch;
