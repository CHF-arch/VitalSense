import styles from "../../styles/SetCardPC.module.css";
import { useTranslation } from "react-i18next";
import BackButton from "../common/BackButton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PC1 from "../../images/PC_1.png";
import PC2 from "../../images/PC_2.png";
import PC3 from "../../images/PC_3.png";
import PC4 from "../../images/PC_4.png";
import PC5 from "../../images/PC_5.png";
import PC6 from "../../images/PC_6.png";
import PC7 from "../../images/PC_7.png";

export default function SetCardPC() {
  const { t } = useTranslation();
  const { clientId } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

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
    { text: t("setcardpc.step_1_text"), image: PC1 },
    { text: t("setcardpc.step_2_text"), image: PC2 },
    { text: t("setcardpc.step_3_text"), image: PC3 },
    { text: t("setcardpc.step_4_text"), image: PC3 },
    { text: t("setcardpc.step_5_text"), image: PC4 },
    { text: t("setcardpc.step_6_text"), image: PC5 },
    { text: t("setcardpc.step_7_text"), image: PC6 },
    { text: t("setcardpc.step_8_text"), image: PC7 },
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
              <div key={index} className={styles.instructionItem}>
                <p>{step.text}</p>
                {step.image && (
                  <button
                    onClick={() => openModal(step.image)}
                    className={styles.imageButton}
                  >
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      className={styles.stepImage}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <span className={styles.closeButton} onClick={closeModal}>
            &times;
          </span>
          <img
            className={styles.modalContent}
            src={selectedImage}
            alt="Enlarged step"
          />
        </div>
      )}
    </div>
  );
}