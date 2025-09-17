import React from 'react';
import { MdMenu } from 'react-icons/md';
import styles from '../styles/MobileNavBar.module.css';

const MobileNavBar = ({ onMenuClick }) => {
  return (
    <div className={styles.mobileNavBar}>
      <button onClick={onMenuClick} className={styles.menuButton}>
        <MdMenu size={28} />
      </button>
      <div className={styles.brandTitle}>Vital Sense</div>
    </div>
  );
};

export default MobileNavBar;
