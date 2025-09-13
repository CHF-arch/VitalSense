import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../../styles/common.module.css";

const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button className={styles.backButton} onClick={() => navigate(-1)}>
      {t("common.back")}
    </button>
  );
};

export default BackButton;
