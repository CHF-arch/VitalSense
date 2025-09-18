import { Link } from "react-router-dom";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";
import AddQuickClientButton from "./AddQuickClientButton";

export default function Toolbar({
  searchTerm,
  setSearchTerm,
  handleExport,
  onClientAdded,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.toolbar}>
      <input
        type="text"
        placeholder={t("clientlist.search_clients")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <button onClick={handleExport} className={styles.exportButton}>
        {t("clientlist.export_to_excel")}
      </button>
      <AddQuickClientButton onClientAdded={onClientAdded} />
    </div>
  );
}
