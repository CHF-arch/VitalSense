import styles from "../../styles/AddQuickClient.module.css";
import { useTranslation } from "react-i18next";
import { createClient } from "../../services/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddQuickClient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    navigate("/clients");
  };
  return (
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
        <button className={styles.button}>
          {t("add_client.submit_button")}
        </button>
      </form>
    </div>
  );
}
