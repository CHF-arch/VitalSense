import { useTranslation } from "react-i18next";
import styles from "../../styles/PrivacyAndTerms.module.css";

export default function PrivacyAndTerms() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "el" : "en");
  };

  return (
    <div className={styles.container}>
      <button onClick={toggleLanguage} className={styles.languageButton}>
        {i18n.language === "en" ? "Ελληνικά" : "English"}
      </button>
      <h1 className={styles.title}>{t("privacy_policy.title")}</h1>
      <p className={styles.lastUpdated}>{t("privacy_policy.last_updated")}</p>

      <p>{t("privacy_policy.intro_paragraph_1")}</p>

      <p>{t("privacy_policy.intro_paragraph_2")}</p>

      <h2 className={styles.subtitle}>
        {t("privacy_policy.interpretation_definitions_title")}
      </h2>
      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.interpretation_subtitle")}
      </h3>
      <p>{t("privacy_policy.interpretation_paragraph")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.definitions_subtitle")}
      </h3>
      <p>{t("privacy_policy.definitions_paragraph")}</p>

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.account_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.affiliate_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.application_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.company_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.country_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.device_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.personal_data_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.service_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.service_provider_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.usage_data_definition"),
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy_policy.you_definition"),
        }}
      />

      <h2 className={styles.subtitle}>
        {t("privacy_policy.collecting_using_data_title")}
      </h2>
      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.types_of_data_subtitle")}
      </h3>
      <h4 className={styles.subSubSubtitle}>
        {t("privacy_policy.personal_data_subtitle")}
      </h4>
      <p>{t("privacy_policy.personal_data_paragraph")}</p>

      <ul>
        <li>{t("privacy_policy.email_address")}</li>
        <li>{t("privacy_policy.first_last_name")}</li>
        <li>{t("privacy_policy.phone_number")}</li>
        <li>{t("privacy_policy.usage_data_list_item")}</li>
      </ul>

      <h4 className={styles.subSubSubtitle}>
        {t("privacy_policy.usage_data_subtitle_2")}
      </h4>
      <p>{t("privacy_policy.usage_data_paragraph_1")}</p>

      <p>{t("privacy_policy.usage_data_paragraph_2")}</p>

      <p>{t("privacy_policy.usage_data_paragraph_3")}</p>

      <p>{t("privacy_policy.usage_data_paragraph_4")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.use_of_personal_data_subtitle")}
      </h3>
      <p>{t("privacy_policy.use_of_personal_data_paragraph")}</p>

      <ul>
        <li>{t("privacy_policy.purpose_1")}</li>
        <li>{t("privacy_policy.purpose_2")}</li>
        <li>{t("privacy_policy.purpose_3")}</li>
        <li>{t("privacy_policy.purpose_4")}</li>
        <li>{t("privacy_policy.purpose_5")}</li>
        <li>{t("privacy_policy.purpose_6")}</li>
        <li>{t("privacy_policy.purpose_7")}</li>
        <li>{t("privacy_policy.purpose_8")}</li>
      </ul>

      <p>{t("privacy_policy.share_personal_info_paragraph")}</p>

      <ul>
        <li>{t("privacy_policy.share_1")}</li>
        <li>{t("privacy_policy.share_2")}</li>
        <li>{t("privacy_policy.share_3")}</li>
        <li>{t("privacy_policy.share_4")}</li>
        <li>{t("privacy_policy.share_5")}</li>
        <li>{t("privacy_policy.share_6")}</li>
      </ul>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.retention_of_data_subtitle")}
      </h3>
      <p>{t("privacy_policy.retention_paragraph_1")}</p>

      <p>{t("privacy_policy.retention_paragraph_2")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.transfer_of_data_subtitle")}
      </h3>
      <p>{t("privacy_policy.transfer_paragraph_1")}</p>

      <p>{t("privacy_policy.transfer_paragraph_2")}</p>

      <p>{t("privacy_policy.transfer_paragraph_3")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.delete_personal_data_subtitle")}
      </h3>
      <p>{t("privacy_policy.delete_paragraph_1")}</p>

      <p>{t("privacy_policy.delete_paragraph_2")}</p>

      <p>{t("privacy_policy.delete_paragraph_3")}</p>

      <p>{t("privacy_policy.delete_paragraph_4")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.disclosure_of_data_subtitle")}
      </h3>
      <h4 className={styles.subSubSubtitle}>
        {t("privacy_policy.business_transactions_subtitle")}
      </h4>
      <p>{t("privacy_policy.business_transactions_paragraph")}</p>

      <h4 className={styles.subSubSubtitle}>
        {t("privacy_policy.law_enforcement_subtitle")}
      </h4>
      <p>{t("privacy_policy.law_enforcement_paragraph")}</p>

      <h4 className={styles.subSubSubtitle}>
        {t("privacy_policy.other_legal_requirements_subtitle")}
      </h4>
      <p>{t("privacy_policy.other_legal_requirements_paragraph")}</p>

      <ul>
        <li>{t("privacy_policy.legal_req_1")}</li>
        <li>{t("privacy_policy.legal_req_2")}</li>
        <li>{t("privacy_policy.legal_req_3")}</li>
        <li>{t("privacy_policy.legal_req_4")}</li>
        <li>{t("privacy_policy.legal_req_5")}</li>
      </ul>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.security_of_data_subtitle")}
      </h3>
      <p>{t("privacy_policy.security_paragraph")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.children_privacy_subtitle")}
      </h3>
      <p>{t("privacy_policy.children_privacy_paragraph_1")}</p>

      <p>{t("privacy_policy.children_privacy_paragraph_2")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.links_to_other_websites_subtitle")}
      </h3>
      <p>{t("privacy_policy.links_paragraph_1")}</p>

      <p>{t("privacy_policy.links_paragraph_2")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.changes_to_policy_subtitle")}
      </h3>
      <p>{t("privacy_policy.changes_paragraph_1")}</p>

      <p>{t("privacy_policy.changes_paragraph_2")}</p>

      <p>{t("privacy_policy.changes_paragraph_3")}</p>

      <h3 className={styles.subSubtitle}>
        {t("privacy_policy.contact_us_subtitle")}
      </h3>
      <p>{t("privacy_policy.contact_us_paragraph")}</p>

      <ul>
        <li>
          {t("privacy_policy.contact_method_1")}{" "}
          <a href="https://www.vitalsense.gr/privacy-policy">
            https://www.vitalsense.gr/privacy-policy
          </a>
        </li>
        <li>{t("privacy_policy.contact_method_2")}</li>
      </ul>
    </div>
  );
}
