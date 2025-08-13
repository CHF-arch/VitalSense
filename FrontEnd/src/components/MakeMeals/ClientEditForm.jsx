import React from "react";
import styles from "../../styles/MakeMeals.module.css";

const ClientEditForm = ({
  editedClientData,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className={styles.editForm}>
      <div className={styles.formRow}>
        <label htmlFor="editFirstName">First Name</label>
        <input
          id="editFirstName"
          type="text"
          name="firstName"
          value={editedClientData.firstName}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editLastName">Last Name</label>
        <input
          id="editLastName"
          type="text"
          name="lastName"
          value={editedClientData.lastName}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editEmail">Email</label>
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
        <label htmlFor="editPhone">Phone</label>
        <input
          id="editPhone"
          type="text"
          name="phone"
          value={editedClientData.phone}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editDateOfBirth">Date of Birth</label>
        <input
          id="editDateOfBirth"
          type="date"
          name="dateOfBirth"
          value={editedClientData.dateOfBirth}
          onChange={onInputChange}
          className={styles.inputField}
        />
        <label htmlFor="editGender">Gender</label>
        <select
          id="editGender"
          name="gender"
          value={editedClientData.gender}
          onChange={onInputChange}
          className={styles.inputField}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label htmlFor="editHasCard" className={styles.checkboxLabel}>
          <input
            id="editHasCard"
            type="checkbox"
            name="hasCard"
            checked={editedClientData.hasCard}
            onChange={onInputChange}
          />
          Has Card
        </label>
      </div>
      <label htmlFor="editNotes">Notes</label>
      <textarea
        id="editNotes"
        name="notes"
        value={editedClientData.notes}
        onChange={onInputChange}
        className={styles.textareaField}
      />
      <div className={styles.actions}>
        <button type="button" className={styles.saveButton} onClick={onSave}>
          Save Client
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClientEditForm;
