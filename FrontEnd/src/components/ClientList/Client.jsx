import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClientById } from "../../services/client";
import { fetchQuestionnaireSubmissionsByClientId } from "../../services/questionnaireTemplate";
import styles from "../../styles/ClientInfoCard.module.css";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaPhone,
  FaHome,
  FaBirthdayCake,
  FaVenusMars,
  FaCreditCard,
  FaStickyNote,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

const Client = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        setClient(clientData);
        const submissionData = await fetchQuestionnaireSubmissionsByClientId(
          clientId
        );
        setSubmissions(submissionData);
      } catch (err) {
        setError(t("client.error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, t]);

  const getGender = (gender) => {
    if (!gender) return "";
    return gender.toLowerCase() === "male"
      ? t("client.male", "Male")
      : t("client.female", "Female");
  };

  if (loading) {
    return <div>{t("client.loading")}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!client) {
    return <div>{t("client.not_found")}</div>;
  }

  const iconColor = theme === "dark" ? "white" : "black";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>
          {client.firstName} {client.lastName}
        </h2>
      </div>
      <div className={styles.body}>
        {client.email && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaEnvelope color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.email")}:</span>
            <span className={styles.value}>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaPhone color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.phone")}:</span>
            <span className={styles.value}>{client.phone}</span>
          </div>
        )}
        {client.address && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaHome color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.address")}:</span>
            <span className={styles.value}>{client.address}</span>
          </div>
        )}
        {client.dateOfBirth && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaBirthdayCake color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.dob")}:</span>
            <span className={styles.value}>
              {new Date(client.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        )}
        {client.gender && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaVenusMars color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.gender")}:</span>
            <span className={styles.value}>{getGender(client.gender)}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <span className={styles.icon}>
            <FaCreditCard color={iconColor} />
          </span>
          <span className={styles.label}>{t("client.hasCard")}:</span>
          <span
            className={`${styles.value} ${
              client.hasCard ? styles.hasCard : ""
            }`}
          >
            {client.hasCard ? t("yes") : t("no")}
          </span>
        </div>
        {client.notes && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaStickyNote color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.notes")}:</span>
            <span className={styles.value}>{client.notes}</span>
          </div>
        )}
        {client.createdAt && (
          <div className={styles.infoRow}>
            <span className={styles.icon}>
              <FaCalendarAlt color={iconColor} />
            </span>
            <span className={styles.label}>{t("client.createdAt")}:</span>
            <span className={styles.value}>
              {new Date(client.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      <div className={styles.questionnaire}>
        <h3>{t("client.questionnaire_answers")}</h3>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className={styles.submission}>
              <h4>
                {submission.templateTitle} - {t("client.submission_date")}:{" "}
                {new Date(submission.submittedAt).toLocaleDateString()}
              </h4>
              {submission.answers.map((answer) => (
                <div key={answer.questionId} className={styles.answer}>
                  <p>
                    <strong>{answer.questionText}:</strong> {answer.answerText}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>{t("client.no_submissions")}</p>
        )}
      </div>
    </div>
  );
};

export default Client;