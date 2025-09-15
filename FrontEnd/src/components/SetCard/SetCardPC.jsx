import styles from "../../styles/SetCardPC.module.css";
import { useTranslation } from "react-i18next";
import BackButton from "../common/BackButton";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function SetCardPC() {
  const { t } = useTranslation();
  const { clientId } = useParams();
  const [isCopied, setIsCopied] = useState(false);

  const url = `${window.location.origin}/today-meal/${clientId}/active`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const pcSteps = [
    t("setcardpc.step_1_text"),
    t("setcardpc.step_2_text"),
    t("setcardpc.step_3_text"),
    t("setcardpc.step_4_text"),
    t("setcardpc.step_5_text"),
    t("setcardpc.step_6_text"),
    t("setcardpc.step_7_text"),
    t("setcardpc.step_8_text"),
    t("setcardpc.step_9_text"),
  ];

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.title}>{t("setcardpc.how_to_set_card_pc")}</div>
      <div className={styles.step}>
        <div className={styles.stepTitle}>{t("setcardpc.step_1")}</div>
        <div className={styles.stepContent}>
          <p className={styles.infoBox}>{t("setcard.copy_link_pc")}</p>
          <button onClick={handleCopy} className={styles.copyButton}>
            {isCopied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
      <div className={styles.step}>
        <div className={styles.stepTitle}>{t("setcardpc.step_2")}</div>
        <div className={styles.stepContent}>
          <div className={styles.instructionsContainer}>
            {pcSteps.map((step, index) => (
              <p key={index} className={styles.instructionItem}>
                {step}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
