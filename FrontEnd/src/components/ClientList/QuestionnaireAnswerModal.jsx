import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import modalStyles from "../../styles/Modal.module.css";
import styles from "../../styles/QuestionnaireAnswerModal.module.css"; // Assuming a generic modal style
import {
  fetchQuestionnaireTemplateById,
  SubmitQuestionnaire,
} from "../../services/questionnaireTemplate"; // SubmitQuestionnaireAnswers will be created

export default function QuestionnaireAnswerModal({
  clientId,
  questionnaireTemplateId,
  onClose,
  onSubmitSuccess,
}) {
  const { t } = useTranslation();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const fetchedTemplate = await fetchQuestionnaireTemplateById(
          questionnaireTemplateId
        );
        setTemplate(fetchedTemplate);
        // Initialize answers state with empty strings for each question
        const initialAnswers = {};
        fetchedTemplate.questions.forEach((q) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch questionnaire template:", err);
      } finally {
        setLoading(false);
      }
    };

    getTemplate();
  }, [questionnaireTemplateId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Transform answers into the format expected by the backend
      const submissionData = {
        clientId: clientId,
        templateId: questionnaireTemplateId,
        answers: Object.keys(answers).map((questionId) => ({
          questionId: questionId,
          answerText: answers[questionId],
        })),
      };
      await SubmitQuestionnaire(submissionData);
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err);
      console.error("Failed to submit questionnaire answers:", err);
      alert(t("questionnaire.submit_error")); // Localize this message
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>{t("common.loading")}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>
            {t("common.error_loading_data")}: {error.message}
          </p>
          <button onClick={onClose}>{t("common.close")}</button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>{t("questionnaire.no_template_found")}</p>
          <button onClick={onClose}>{t("common.close")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2>
          {t("questionnaire_template.answer_modal_title", {
            templateName: template.name,
          })}
        </h2>
        <form>
          {template.questions.map((question, index) => (
            <div key={question.id} className={styles.questionnaireFormGroup}>
              <label
                htmlFor={`question-${question.id}`}
                className={styles.questionLabel}
              >
                {index + 1}. {question.questionText}{" "}
                {question.isRequired && <span style={{ color: "red" }}>*</span>}
              </label>
              <textarea
                id={`question-${question.id}`}
                className={styles.questionTextarea}
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                rows="3"
                required={question.isRequired}
              />
            </div>
          ))}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? t("common.submitting") : t("common.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
