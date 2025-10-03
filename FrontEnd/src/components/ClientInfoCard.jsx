import React, { useContext } from "react";
import styles from "../styles/ClientInfoCard.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaStickyNote,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function ClientInfoCard({ client }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  if (!client) {
    return null;
  }

  const iconColor = theme === "light" ? "#333" : "#fff";

  const renderInfo = (icon, label, value) => (
    <div className={styles.infoRow}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{value}</span>
    </div>
  );

  const getGender = (gender) => {
    if (!gender) return null;
    return gender.toLowerCase() === "male"
      ? t("client_info_card.male")
      : t("client_info_card.female");
  };

  const formatDate = (date) => {
    if (!date) return null;
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
            <span className={styles.icon}>
              <FaCreditCard color={iconColor} />
            </span>
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
        {client.email &&
          renderInfo(
            <FaEnvelope color={iconColor} />,
            t("client_info_card.email"),
            client.email
          )}
        {client.phone &&
          renderInfo(
            <FaPhone color={iconColor} />,
            t("client_info_card.phone_number"),
            client.phone
          )}
        {client.dateOfBirth &&
          renderInfo(
            <FaBirthdayCake color={iconColor} />,
            t("client_info_card.date_of_birth"),
            formatDate(client.dateOfBirth)
          )}
        {client.gender &&
          renderInfo(
            <FaVenusMars color={iconColor} />,
            t("client_info_card.gender"),
            getGender(client.gender)
          )}
      </div>
      {client.notes && (
        <div className={styles.footer}>
          <h4 className={styles.notesTitle}>
            <FaStickyNote color={iconColor} /> {t("client_info_card.notes")}
          </h4>
          <p className={styles.notes}>{client.notes}</p>
        </div>
      )}
    </div>
  );
}