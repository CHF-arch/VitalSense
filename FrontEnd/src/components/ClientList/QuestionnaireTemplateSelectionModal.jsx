import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal";
import styles from "../../styles/Modal.module.css"; // Import modal styles

export default function QuestionnaireTemplateSelectionModal({
  templates,
  clientId,
  onSubmit,
}) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates[0]?.id || ""
  );

  const handleSubmit = () => {
    if (selectedTemplate) {
      onSubmit(selectedTemplate);
    } else {
      alert("Please select a template.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{t("questionnaire_template.select_questionnaire_template")}</h2>
        <div className={styles.formGroup}>
          <label htmlFor="template-select">{t("clientlist.template")}:</label>
          <select
            id="template-select"
            className={styles.select}
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={closeModal}
            className={styles.cancelButton}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            {t("common.select")}
          </button>
        </div>
      </div>
    </div>
  );
}
