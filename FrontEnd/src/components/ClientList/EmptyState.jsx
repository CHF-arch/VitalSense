import AddQuickClientButton from "./AddQuickClientButton";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { importClientsFromExcel } from "../../services/client";

export default function EmptyState({ onClientAdded }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importClientsFromExcel(file);
      onClientAdded();
    } catch (error) {
      console.error("Error importing clients:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <h1 className={styles.h1}>{t("clientlist.no_clients_found")}</h1>
        <p>{t("clientlist.start_building")}</p>
        <div className={styles.emptyStateButtons}>
          <AddQuickClientButton onClientAdded={onClientAdded} />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImport}
            accept=".xlsx, .xls"
          />
          <button
            id="import-excel-button"
            className={styles.importButton}
            onClick={handleImportClick}
          >
            {t("clientlist.import_from_excel")}
          </button>
        </div>
      </div>
    </div>
  );
}
