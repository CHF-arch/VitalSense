import styles from "../../styles/SetCard.module.css";
import { useTheme } from "../../hooks/useTheme";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import nfc_tools_1 from "../../images/nfc_tools_1.jpg";
import nfc_tools_2 from "../../images/nfc_tools_2.jpg";
import nfc_tools_3 from "../../images/nfc_tools_3.jpg";
import nfc_tools_4 from "../../images/nfc_tools_4.jpg";
import nfc_tools_5 from "../../images/nfc_tools_5.jpg";
import nfc_tools_6 from "../../images/nfc_tools_6.jpg";
import nfc_tools_7 from "../../images/nfc_tools_7.jpg";
import nfc_tools_8 from "../../images/nfc_tools_8.jpg";
import nfc_tools_9 from "../../images/nfc_tools_9.jpg";

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

  const nfcSteps = [
    {
      text: t("setcard.open_nfc_tools"),
      image: nfc_tools_1,
    },
    {
      text: t("setcard.select_write"),
      image: nfc_tools_2,
    },
    {
      text: t("setcard.select_add"),
      image: nfc_tools_3,
    },
    {
      text: t("setcard.select_url"),
      image: nfc_tools_4,
    },
    {
      text: t("setcard.paste_url"),
      image: nfc_tools_5,
    },
    {
      text: t("setcard.press_ok"),
      image: nfc_tools_6,
    },
    {
      text: t("setcard.select_write_byte"),
      image: nfc_tools_7,
    },
    {
      text: t("setcard.write_card"),
      image: nfc_tools_8,
    },
    {
      text: t("setcard.check"),
      image: nfc_tools_9,
    },
  ];

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
            {nfcSteps.map((step, index) => (
              <div key={index} className={styles.photoContainer}>
                <img
                  src={step.image}
                  alt={step.text}
                  className={styles.photo}
                />
                <p>{step.text}</p>
              </div>
            ))}
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
          <p className={styles.nfcNote}>{t("setcard.nfc_note")}</p>
        </div>
      </div>
    </div>
  );
}
