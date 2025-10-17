import styles from '../../styles/Pagination.module.css';
import { useTranslation } from "react-i18next";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        {t("common.previous")}
      </button>
      {
        pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
          >
            {number}
          </button>
        ))
      }
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        {t("common.next")}
      </button>
    </nav>
  );
};

export default Pagination;
