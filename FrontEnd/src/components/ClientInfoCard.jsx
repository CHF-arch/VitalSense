import React from "react";
import styles from "../styles/ClientInfoCard.module.css";
import { useTranslation } from "react-i18next";

export default function ClientInfoCard({ client, onEditClick }) {
  const { t } = useTranslation();
  if (!client) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>
          {client.firstName} {client.lastName}
        </h2>
        <div className={styles.headerActions}>
          <span
            className={`${styles.status} ${
              client.hasCard ? styles.hasCard : ""
            }`}
          >
            {client.hasCard ? "Card Holder" : "No Card"}
          </span>
          <button onClick={onEditClick} className={styles.editButton}>
            {t("client_info_card.edit_client")}
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.infoRow}>
          <span className={styles.label}>{t("client_info_card.email")}:</span>
          <span className={styles.value}>{client.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>{t("client_info_card.phone")}:</span>
          <span className={styles.value}>{client.phone}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>
            {t("client_info_card.date_of_birth")}:
          </span>
          <span className={styles.value}>
            {new Date(client.dateOfBirth).toLocaleDateString()}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>{t("client_info_card.gender")}:</span>
          <span className={styles.value}>{client.gender}</span>
        </div>
      </div>
      {client.notes && (
        <div className={styles.footer}>
          <p className={styles.notes}>{client.notes}</p>
        </div>
      )}
    </div>
  );
}
