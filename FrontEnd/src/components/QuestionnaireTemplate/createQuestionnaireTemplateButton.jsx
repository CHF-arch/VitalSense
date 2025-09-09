import React from "react";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from "../../context/useModal";

export default function CreateQuestionnaireTemplateButton() {
  const { t } = useTranslation();
  const { openCreateQuestionnaireTemplateModal } = useModal();

  return (
    <button onClick={openCreateQuestionnaireTemplateModal} className={styles.button}>
      {t("questionnaire_template.create_new")}
    </button>
  );
}