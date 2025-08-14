// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/ModeSwitcher.jsx
import React from "react";
import styles from "../../styles/ModeSwitcher.module.css";
import { useTranslation } from "react-i18next";

const ModeSwitcher = ({ mode, setMode }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.modeSwitcherContainer}>
      <button
        type="button"
        onClick={() => setMode("search")}
        className={`${styles.modeButton} ${
          mode === "search"
            ? styles.modeButtonActive
            : styles.modeButtonInactive
        }`}
      >
        {t("appointments.search_existing_client")}
      </button>
      <button
        type="button"
        onClick={() => setMode("add")}
        className={`${styles.modeButton} ${
          mode === "add" ? styles.modeButtonActive : styles.modeButtonInactive
        }`}
      >
        {t("appointments.add_new_client")}
      </button>
    </div>
  );
};

export default ModeSwitcher;
