import React, { useState } from "react";
import styles from "../styles/AddClient.module.css";
import { createClient } from "../services/client";

export default function AddClient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hasCard, setHasCard] = useState(false);
  const [notes, setNotes] = useState("");
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().split("T")[0]
  );

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
  };
  return (
    <div className={styles.addClientContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>Add New Client</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              First Name:
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
              Last Name:
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
              Email:
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
              Phone:
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
              Date of Birth:
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
              Gender:
              <select
                className={styles.input}
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
              Has Card
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Notes:
            <textarea
              className={styles.textarea}
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about the client..."
            />
          </label>
        </div>
        <button className={styles.button} type="submit">
          Add Client
        </button>
      </form>
    </div>
  );
}
