import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.topDiv}>
          <h2>Top Section</h2>
          <p>This is the top dashboard area.</p>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.contentBox1}>
            <h3>Main Content - Top</h3>
            <p>Content for the first main content div.</p>
          </div>
          <div className={styles.contentBox2}>
            <h3>Main Content - Bottom</h3>
            <p>Content for the second main content div.</p>
          </div>
        </div>
      </div>
      <div className={styles.sidebar}>
        <h2>Dashboard Sidebar</h2>
        <p>This is the new full-height sidebar.</p>
      </div>
    </div>
  );
}
