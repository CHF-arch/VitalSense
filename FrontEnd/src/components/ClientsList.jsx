import { getAllClients } from "../services/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ClientsList.module.css";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchClients();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (clients.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>No clients found.</h1>
        <Link to="/add-client" className={styles.addButton}>
          Add Client
        </Link>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Customer List</h1>
      <Link to="/add-client" className={styles.addButton}>
        Add Client
      </Link>
      <ul className={styles.clientList}>
        {clients.map((client) => (
          <li key={client.id} className={styles.clientItem}>
            <span className={styles.clientName}>
              {client.firstName} {client.lastName}
            </span>
            <div className={styles.clientDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email: </span>
                {client.email}
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone: </span>
                {client.phone}
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date of Birth: </span>
                {new Date(client.dateOfBirth).toLocaleDateString()}
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Gender: </span>
                {client.gender}
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Card: </span>
                {client.hascard ? "Yes" : "No"}
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Joined: </span>
                {new Date(client.createdAt).toLocaleDateString()}
              </div>
            </div>
            {client.notes && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Notes: </span>
                {client.notes}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
