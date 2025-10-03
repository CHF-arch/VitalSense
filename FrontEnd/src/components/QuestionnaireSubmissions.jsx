
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/QuestionnaireSubmissions.module.css';

const QuestionnaireSubmissions = ({ submissions }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.questionnaire}>
      <h3>{t('client.questionnaire_answers')}</h3>
      {submissions.length > 0 ? (
        submissions.map((submission) => (
          <div key={submission.id} className={styles.submission}>
            <h4>
              {submission.templateTitle} - {t('client.submission_date')}:{' '}
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
        <p>{t('client.no_submissions')}</p>
      )}
    </div>
  );
};

export default QuestionnaireSubmissions;
