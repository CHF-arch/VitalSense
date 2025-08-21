import styles from "../../styles/SetCard.module.css";
import { useTheme } from "../../hooks/useTheme";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SetCard({ clientId }) {
  // By using useTheme, the component will re-render when the theme changes.
  useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();

  const url = `${window.location.origin}/today-meal/${clientId}/active`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("setcard.how_to_set_card")}</div>
      <div className={styles.step}>
        <div className={styles.stepTitle}>{t("setcard.step_1")}</div>
        <div className={styles.stepContent}>
          <p>{t("setcard.scan")}</p>
          <div className={styles.qrCode}>
            <QRCodeSVG value={url} />
          </div>
          <p>{t("setcard.if_phone")}</p>
          <button onClick={handleCopy} className={styles.copyButton}>
            {isCopied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
      <div className={styles.step}>
        <div className={styles.stepTitle}>{t("setcard.step_2")}</div>
        <div className={styles.stepContent}>
          <div className={styles.photoGrid}>
            <div className={styles.photoPlaceholder}>
              {t("setcard.open_nfc_tools")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.select_write")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.select_add")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.select_url")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.paste_url")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.press_ok")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.select_write_byte")}
            </div>
            <div className={styles.photoPlaceholder}>
              {t("setcard.write_card")}
            </div>
            <div className={styles.photoPlaceholder}>{t("setcard.check")}</div>
          </div>
        </div>
      </div>
      <div className={styles.step}>
        <div className={styles.stepTitle}>{t("setcard.step_3")}</div>
        <div className={styles.stepContent}>
          <p>{t("setcard.nfc_instructions")}</p>
          <div className={styles.instructionBoxesContainer}>
            <div className={styles.instructionBox}>
              <strong>{t("setcard.android")}</strong>
              <p>{t("setcard.android_instructions")}</p>
            </div>
            <div className={styles.instructionBox}>
              <strong>{t("setcard.ios")}</strong>
              <p>{t("setcard.ios_instructions")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
