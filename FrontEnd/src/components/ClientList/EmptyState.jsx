import AddQuickClientButton from "./AddQuickClientButton";
import styles from "../../styles/ClientsList.module.css";
import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <h1 className={styles.h1}>{t("clientlist.no_clients_found")}</h1>
        <p>{t("clientlist.start_building")}</p>
        <AddQuickClientButton />
      </div>
    </div>
  );
}
