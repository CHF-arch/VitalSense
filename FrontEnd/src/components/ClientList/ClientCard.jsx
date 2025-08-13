import { Link } from "react-router-dom";
import styles from "../../styles/ClientsList.module.css";

export default function ClientCard({
  client,
  editingClientId,
  editedClientData,
  handleEdit,
  handleDelete,
  handleInputChange,
  handleSave,
  handleCancel,
}) {
  return (
    <div key={client.id} className={styles.clientCard}>
      {editingClientId === client.id ? (
        <div className={styles.editForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              name="firstName"
              value={editedClientData.firstName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="lastName"
              value={editedClientData.lastName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <input
              type="email"
              name="email"
              value={editedClientData.email}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="text"
              name="phone"
              value={editedClientData.phone}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={editedClientData.dateOfBirth}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <select
              name="gender"
              value={editedClientData.gender}
              onChange={handleInputChange}
              className={styles.inputField}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="hasCard"
                checked={editedClientData.hasCard}
                onChange={handleInputChange}
              />
              Has Card
            </label>
          </div>
          <textarea
            name="notes"
            value={editedClientData.notes}
            onChange={handleInputChange}
            className={styles.textareaField}
          />
          <div className={styles.actions}>
            <button
              className={styles.saveButton}
              onClick={() => handleSave(client.id)}
            >
              Save Changes
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cardHeader}>
            <h3 className={styles.clientName}>
              {client.firstName} {client.lastName}
            </h3>
            <div className={styles.cardActions}>
              <button
                className={styles.editIcon}
                onClick={() => handleEdit(client)}
                title="Edit client"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className={styles.deleteIcon}
                onClick={() => handleDelete(client.id)}
                title="Delete client"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.clientInfo}>
            <div className={styles.infoItem}>
              <svg
                className={styles.infoIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className={styles.infoText}>{client.email}</span>
            </div>
            <div className={styles.infoItem}>
              <svg
                className={styles.infoIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className={styles.infoText}>{client.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <svg
                className={styles.infoIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className={styles.infoText}>
                {new Date(client.dateOfBirth).toLocaleDateString()}
              </span>
              <span className={styles.genderBadge}>
                {client.gender === "Male"
                  ? "♂"
                  : client.gender === "Female"
                  ? "♀"
                  : "◦"}
              </span>
              <span className={styles.genderText}>{client.gender}</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.cardStatus}>
              <svg
                className={styles.statusIcon}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span
                className={`${styles.statusBadge} ${
                  client.hasCard ? styles.statusYes : styles.statusNo
                }`}
              >
                {client.hasCard ? "Yes" : "No"}
              </span>
            </div>
            <div className={styles.joinedDate}>
              <span className={styles.joinedLabel}>Joined:</span>
              <span className={styles.joinedText}>
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {client.notes && (
            <div className={styles.notesSection}>
              <div className={styles.notesContent}>{client.notes}</div>
            </div>
          )}

          <div className={styles.mealButtons}>
            <Link
              to={`/make-meals/${client.id}`}
              className={styles.createMealButton}
            >
              Create Meal Plan
            </Link>
            <Link to={`/meal-plans/${client.id}`} className={styles.TodayMealButton}>
              Meal plans
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
