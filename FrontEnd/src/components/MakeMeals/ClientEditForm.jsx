import React from "react";
import styles from "../../styles/MakeMeals.module.css";
import { useTranslation } from "react-i18next";

const ClientEditForm = ({
  editedClientData,
  onInputChange,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.editForm}>
      <div className={styles.formRow}>
        <label htmlFor="editFirstName">{t("make_meals.first_name")}</label>
        <input
          id="editFirstName"
          type="text"
          name="firstName"
          value={editedClientData.firstName}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editLastName">{t("make_meals.last_name")}</label>
        <input
          id="editLastName"
          type="text"
          name="lastName"
          value={editedClientData.lastName}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editEmail">{t("make_meals.email")}</label>
        <input
          id="editEmail"
          type="email"
          name="email"
          value={editedClientData.email}
          onChange={onInputChange}
          className={styles.inputField}
        />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="editPhone">{t("make_meals.phone")}</label>
        <input
          id="editPhone"
          type="text"
          name="phone"
          value={editedClientData.phone}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editDateOfBirth">{t("make_meals.date_of_birth")}</label>
        <input
          id="editDateOfBirth"
          type="date"
          name="dateOfBirth"
          value={editedClientData.dateOfBirth}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editGender">{t("make_meals.gender")}</label>
        <select
          id="editGender"
          name="gender"
          value={editedClientData.gender}
          onChange={onInputChange}
          className={styles.inputField}
        >
          <option value="">{t("make_meals.select_gender")}</option>
          <option value="male">{t("make_meals.male")}</option>
          <option value="female">{t("make_meals.female")}</option>
        </select>
        <label htmlFor="editHasCard" className={styles.checkboxLabel}>
          <input
            id="editHasCard"
            type="checkbox"
            name="hasCard"
            checked={editedClientData.hasCard}
            onChange={onInputChange}
          />
          {t("make_meals.has_card")}
        </label>
      </div>
      <label htmlFor="editNotes">{t("make_meals.notes")}</label>
      <textarea
        id="editNotes"
        name="notes"
        value={editedClientData.notes}
        onChange={onInputChange}
        className={styles.textareaField}
      />
      <div className={styles.actions}>
        <button type="button" className={styles.saveButton} onClick={onSave}>
          {t("make_meals.save_client")}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          {t("make_meals.cancel")}
        </button>
      </div>
    </div>
  );
};

export default ClientEditForm;
