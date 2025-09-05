import styles from "../../styles/AddQuickClient.module.css";
import modalStyles from "../../styles/Modal.module.css"; // New import for modal styles
import { useTranslation } from "react-i18next";
import { createClient } from "../../services/client";
import { useState } from "react";

export default function AddQuickClient({ isOpen, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClient({
      firstName,
      lastName,
      email,
      phone,
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <button className={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.container}>
          <h1 className={styles.title}>{t("clientlist.add_quick_client_title")}</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="firstName">
              {t("add_client.first_name")}
            </label>
            <input
              className={styles.input}
              type="text"
              id="firstName"
              name="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className={styles.label} htmlFor="lastName">
              {t("add_client.last_name")}
            </label>
            <input
              className={styles.input}
              type="text"
              id="lastName"
              name="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label className={styles.label} htmlFor="email">
              {t("add_client.email")}
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className={styles.label} htmlFor="phone">
              {t("add_client.phone_number")}
            </label>
            <input
              className={styles.input}
              type="tel"
              id="phone"
              name="phone"
              required
              maxLength="15"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className={styles.buttonContainer}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                {t("common.cancel")}
              </button>
              <button type="submit" className={styles.button}>
                {t("add_client.submit_button")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
