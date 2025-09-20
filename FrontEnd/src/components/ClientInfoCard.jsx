import React from "react";
import styles from "../styles/ClientInfoCard.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUser,
  FaIdCard,
  FaVenusMars,
} from "react-icons/fa";

export default function ClientInfoCard({ client }) {
  const { t } = useTranslation();

  if (!client) {
    return null;
  }

  const renderInfo = (Icon, label, value) => (
    <div className={styles.infoRow}>
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{value || t("common.not_provided")}</span>
    </div>
  );

  const getGender = (gender) => {
    if (!gender) return t("common.not_provided");
    return gender === "male"
      ? t("client_info_card.male")
      : t("client_info_card.female");
  };

  const formatDate = (date) => {
    if (!date) return t("common.not_provided");
    return new Date(date).toLocaleDateString();
  };

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
            <FaIdCard />
            <span className={styles.statusText}>
              {client.hasCard
                ? t("client_info_card.card_holder")
                : t("client_info_card.no_card")}
            </span>
          </span>
          <Link to={`/edit-client/${client.id}`} className={styles.editLink}>
            {t("client_info_card.edit_client")}
          </Link>
        </div>
      </div>
      <div className={styles.body}>
        {renderInfo(
          FaEnvelope,
          t("client_info_card.email"),
          client.email
        )}
        {renderInfo(FaPhone, t("client_info_card.phone_number"), client.phone)}
        {renderInfo(
          FaBirthdayCake,
          t("client_info_card.date_of_birth"),
          formatDate(client.dateOfBirth)
        )}
        {renderInfo(
          FaVenusMars,
          t("client_info_card.gender"),
          getGender(client.gender)
        )}
      </div>
      {client.notes && (
        <div className={styles.footer}>
          <h4 className={styles.notesTitle}>{t("client_info_card.notes")}</h4>
          <p className={styles.notes}>{client.notes}</p>
        </div>
      )}
    </div>
  );
}
