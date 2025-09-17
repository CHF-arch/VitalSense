import { useTranslation } from "react-i18next";
import styles from "../../styles/Login.module.css";

export default function LoginRequerments({ password }) {
  const { t } = useTranslation();

  const isLongEnough = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  const getRequirementClass = (isMet) =>
    isMet ? styles.requirementMet : styles.requirementUnmet;

  return (
    <div className={styles.requirementsContainer}>
      <h3>{t("login.password_requirements_title")}</h3>
      <ul>
        <li className={getRequirementClass(isLongEnough)}>
          {t("login.password_requirement_8_chars")}
        </li>
        <li className={getRequirementClass(hasUpperCase && hasLowerCase)}>
          {t("login.password_requirement_case_letters")}
        </li>
        <li className={getRequirementClass(hasNumber)}>
          {t("login.password_requirement_one_number")}
        </li>
        <li className={getRequirementClass(hasSpecialChar)}>
          {t("login.password_requirement_special_char")}
        </li>
      </ul>
    </div>
  );
}
