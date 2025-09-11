import React from "react";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal";

export default function CreateQuestionnaireTemplateButton({ onSuccess }) {
  const { t } = useTranslation();
  const { openCreateQuestionnaireTemplateModal } = useModal();

  const handleOpenModal = () => {
    openCreateQuestionnaireTemplateModal(onSuccess);
  };

  return (
    <button onClick={handleOpenModal} className={styles.button}>
      {t("questionnaire_template.create_new")}
    </button>
  );
}
