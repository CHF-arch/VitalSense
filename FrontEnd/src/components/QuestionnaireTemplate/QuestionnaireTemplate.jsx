import { useTranslation } from "react-i18next";
import {
  fetchQuestionnaireTemplates,
  deleteQuestionnaireTemplate,
} from "../../services/questionnaireTemplate";
import { useEffect, useState, useCallback } from "react";
import styles from "../../styles/QuestionnaireTemplate.module.css";
import CreateQuestionnaireTemplateButton from "./createQuestionnaireTemplateButton";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md"; 
import moment from "moment"; 
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/useModal";
import { toast } from "react-toastify";

export default function QuestionnaireTemplate() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const { openConfirmationModal } = useModal();

  const fetchTemplates = useCallback(async () => {
    const data = await fetchQuestionnaireTemplates();
    setTemplates(data);
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEdit = (id) => {
    navigate(`/questionnaire-templates/edit/${id}`);
  };

  const handleDelete = (id) => {
    openConfirmationModal(
      t("questionnaire_template.delete_confirmation"),
      async () => {
        try {
          await deleteQuestionnaireTemplate(id);
          await fetchTemplates();
          toast.success(t("questionnaire_template.delete_success"));
        } catch (error) {
          console.error("Failed to delete template:", error);
          toast.error(t("questionnaire_template.delete_error"));
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWithButton}>
        <h2 className={styles.h1}>{t("questionnaire_template.title")}</h2>
        <div>
          <CreateQuestionnaireTemplateButton onSuccess={fetchTemplates} />
        </div>
      </div>
      <div>
        <ul className={styles.templateList}>
          {templates.map((template) => (
            <li key={template.id} className={styles.templateItem}>
              <div className={styles.templateHeader}>
                <div>
                  <h2>{t("questionnaire_template.title_input")}</h2>
                  <h3>{template.title}</h3>
                </div>
                <div className={styles.templateActions}>
                  <button
                    onClick={() => handleEdit(template.id)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
              <div className={styles.divider}></div>{" "}
              <h2>{t("questionnaire_template.description")}</h2>
              <p className={styles.description}>{template.description}</p>{" "}
              <div className={styles.divider}></div>{" "}
              <div className={styles.dateInfo}>
                <p>
                  {t("questionnaire_template.create")}{" "}
                  {moment
                    .utc(template.createdAt)
                    .local()
                    .format("DD-MM-YYYY HH:mm")}
                </p>
                {moment(template.updatedAt).isValid() &&
                  template.updatedAt !== template.createdAt && (
                    <p>
                      {t("questionnaire_template.last")}{" "}
                      {moment
                        .utc(template.updatedAt)
                        .local()
                        .format("DD-MM-YYYY HH:mm")}
                    </p>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
