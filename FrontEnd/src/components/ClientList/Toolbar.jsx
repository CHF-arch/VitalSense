import { Link } from "react-router-dom";
import styles from "../../styles/ClientsList.module.css";

export default function Toolbar({ searchTerm, setSearchTerm, handleExport }) {
  return (
    <div className={styles.toolbar}>
      <input
        type="text"
        placeholder="Search clients by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <button onClick={handleExport} className={styles.exportButton}>
        Export to Excel
      </button>
      <Link to="/add-client" className={styles.button}>
        Add Client
      </Link>
    </div>
  );
}
