import React from "react";
import { useTheme } from "../../hooks/useTheme";
import styles from "../../styles/Settings.module.css";
import { useTranslation } from "react-i18next";
import { authorizeUrl } from "../../services/google";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const handleGoogleSignIn = async () => {
    try {
      const response = authorizeUrl();
      const data = await response.json();
      if (data) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };
  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.title}>{t("settings.title")}</h1>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>
          {t("settings.theme_section_title")}
        </h2>
        <button onClick={toggleTheme} className={styles.button}>
          {theme === "light"
            ? t("settings.switch_to_dark_theme")
            : t("settings.switch_to_light_theme")}
        </button>
      </div>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>
          {t("settings.language_section_title")}
        </h2>
        <div className={styles.buttonGroup}>
          <select
            value={i18n.resolvedLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className={styles.languageSelect}
          >
            <option value="en">{t("settings.english")}</option>
            <option value="el">{t("settings.greek")}</option>
          </select>
        </div>
      </div>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>
          {t("settings.account_section_title")}
        </h2>
        <button onClick={handleGoogleSignIn} className={styles.button}>
          {t("settings.sign_in_with_google")}
        </button>
      </div>
    </div>
  );
}
