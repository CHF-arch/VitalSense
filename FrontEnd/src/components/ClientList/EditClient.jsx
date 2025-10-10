import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, updateClient } from "../../services/client";
import styles from "../../styles/AddClient.module.css";
import { useTranslation } from "react-i18next";
import BackButton from "../common/BackButton";

export default function EditClient() {
  const { clientId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    hasCard: false,
    notes: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getClientById(clientId);
        if (client) {
          const {
            id, 
            dieticianId, 
            createdAt, 
            updatedAt, 
            ...editableClientData
          } = client;
          setClientData({
            ...editableClientData,
            dateOfBirth: editableClientData.dateOfBirth
              ? editableClientData.dateOfBirth.split("T")[0]
              : "",
          });
        } else {
          console.warn("Client not found for ID:", clientId);
          navigate("/clients"); // Example: navigate back to client list
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    fetchClient();
  }, [clientId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...clientData,
        dateOfBirth: clientData.dateOfBirth || null,
      };
      await updateClient(clientId, dataToSend);
      navigate(-1); // Navigate back after successful update
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className={styles.addClientContainer}>
      <BackButton />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>{t("edit_client.title")}</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.first_name")}:
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={clientData.firstName}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.last_name")}:
              <input
                className={styles.input}
                type="text"
                name="lastName"
                value={clientData.lastName}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.email")}:
              <input
                className={styles.input}
                type="email"
                name="email"
                value={clientData.email}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.phone_number")}:
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={clientData.phone}
                onChange={handleInputChange}
                maxLength="15"
                required
              />
            </label>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.date_of_birth")}:
              <input
                className={styles.input}
                type="date"
                name="dateOfBirth"
                value={clientData.dateOfBirth}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.gender")}:
              <select
                className={styles.input}
                name="gender"
                value={clientData.gender}
                onChange={handleInputChange}
              >
                <option value="">{t("add_client.select_gender")}</option>
                <option value="Male">{t("add_client.male")}</option>
                <option value="Female">{t("add_client.female")}</option>
              </select>
            </label>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                name="hasCard"
                checked={clientData.hasCard}
                onChange={handleInputChange}
              />
              {t("add_client.has_card")}
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t("add_client.notes")}:
            <textarea
              className={styles.textarea}
              name="notes"
              value={clientData.notes}
              onChange={handleInputChange}
              placeholder={t("add_client.add_any_relevant")}
            />
          </label>
        </div>
        <button className={styles.button} type="submit">
          {t("edit_client.submit_button")}
        </button>
      </form>
    </div>
  );
}
