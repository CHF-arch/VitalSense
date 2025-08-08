import { Link } from "react-router-dom";
import styles from "../../styles/ClientsList.module.css";

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <h1 className={styles.h1}>No clients found</h1>
        <p>Start building your client base by adding your first client.</p>
        <Link to="/add-client" className={styles.button}>
          Add Your First Client
        </Link>
      </div>
    </div>
  );
}
