import React from 'react';
import styles from '../../styles/MakeMeals.module.css';

const PlanDetails = ({ planTitle, setPlanTitle, startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className={styles.planDetails}>
      <label htmlFor="planTitle">Plan Title</label>
      <input
        id="planTitle"
        type="text"
        placeholder="Meal Plan Title"
        value={planTitle}
        onChange={(e) => setPlanTitle(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="startDate">Start Date</label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="endDate">End Date</label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        className={styles.input}
      />
    </div>
  );
};

export default PlanDetails;
