import React, { useState } from "react";
import styles from "../../styles/AddClient.module.css";
import { createClient } from "../../services/client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AddClient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hasCard, setHasCard] = useState(false);
  const [notes, setNotes] = useState("");
  const createdAt = new Date().toISOString().split("T")[0];
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClient({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      hasCard,
      notes,
      createdAt,
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");
    setGender("");
    setHasCard(false);
    setNotes("");
    navigate("/clients");
  };
  return (
    <div className={styles.addClientContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>{t("add_client.title")}</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.first_name")}:
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("add_client.gender")}:
              <select
                className={styles.input}
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">{t("add_client.select_gender")}</option>
                <option value="male">{t("add_client.male")}</option>
                <option value="female">{t("add_client.female")}</option>
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
                checked={hasCard}
                onChange={(e) => setHasCard(e.target.checked)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("add_client.add_any_relevant")}
            />
          </label>
        </div>
        <button className={styles.button} type="submit">
          {t("add_client.submit_button")}
        </button>
      </form>
    </div>
  );
}
