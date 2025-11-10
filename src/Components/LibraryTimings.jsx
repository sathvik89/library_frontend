import React from "react";
import styles from "../Styles/Librarytime.module.css";
export default function LibraryTimings() {
  const weekdayTimings = "9 AM to 11 PM";
  const sundayTimings = "9 AM to 5 PM";

  return (
    <section className={styles.mainLibrarytime}>
      <h2 className={styles.libraryTitle}>Library Timings</h2>
      
      <ul className={styles.librarylist}>
        <li>
          <strong>Monday to Saturday:</strong> {weekdayTimings}
        </li>
        <li>
          <strong>Sunday:</strong> {sundayTimings}
        </li>
      </ul>
      <p className={styles.LibraryPara}>
        Please plan your visit accordingly. We look forward to seeing you at the
        library!
      </p>
    </section>
  );
}
