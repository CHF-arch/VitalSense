import React from "react";
import { useTheme } from "../../hooks/useTheme";
import styles from "../../styles/Settings.module.css";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  const handleLanguageChange = (lang) => {
    // Placeholder for language change logic
    console.log(`Language changed to ${lang}`);
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google Sign-In logic
    console.log("Initiating Google Sign-In");
  };
  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Theme</h2>
        <button onClick={toggleTheme} className={styles.button}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      </div>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Language</h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => handleLanguageChange("en")}
            className={styles.button}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange("gr")}
            className={styles.button}
          >
            Greek
          </button>
        </div>
      </div>
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <button onClick={handleGoogleSignIn} className={styles.button}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
