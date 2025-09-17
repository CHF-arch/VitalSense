import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import styles from "../../styles/Settings.module.css";
import { useTranslation } from "react-i18next";
import {
  authorizeUrl,
  getGoogleConnectionStatus,
  disconnectGoogle,
  sendGoogleCallback,
} from "../../services/google";
import googleIcon from "../../assets/google-icon.svg";
import { useModal } from "../../context/useModal";
import EmailChangeModal from "./EmailChangeModal";
import PasswordChangeModal from "./PasswordChangeModal";
import UsernameChangeModal from "./UsernameChangeModal";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getGoogleConnectionStatus();
        setIsGoogleConnected(status.isConnected);
      } catch (error) {
        console.error("Error checking Google connection status:", error);
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        try {
          await sendGoogleCallback(code, state);
          const status = await getGoogleConnectionStatus();
          setIsGoogleConnected(status.isConnected);
          // Clean up the URL
          window.history.replaceState({}, document.title, "/settings");
        } catch (error) {
          console.error("Error handling Google callback:", error);
        }
      }
    };

    handleCallback();
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleGoogleSignIn = async () => {
    try {
      const data = await authorizeUrl();
      if (data && data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      await disconnectGoogle();
      setIsGoogleConnected(false);
    } catch (error) {
      console.error("Error disconnecting Google account:", error);
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
        <div className={styles.buttonContainer}>
          <button
            onClick={() => openModal(<UsernameChangeModal />)}
            className={styles.button}
          >
            {t("settings.change_username")}
          </button>
          <button
            onClick={() => openModal(<EmailChangeModal />)}
            className={styles.button}
          >
            {t("settings.change_email")}
          </button>
          <button
            onClick={() => openModal(<PasswordChangeModal />)}
            className={styles.button}
          >
            {t("settings.change_password")}
          </button>
        </div>
        <button
          onClick={
            isGoogleConnected ? handleGoogleDisconnect : handleGoogleSignIn
          }
          className={isGoogleConnected ? styles.button : styles.googleButton}
        >
          {!isGoogleConnected && (
            <img
              src={googleIcon}
              alt="Google icon"
              className={styles.googleIcon}
            />
          )}
          {isGoogleConnected
            ? t("settings.disconnect_google")
            : t("settings.sign_in_with_google")}
        </button>
      </div>
    </div>
  );
}
