import React from "react";
import styles from "@/Styles/RightsReserved.module.css";

export default function RightsReserved() {
  return (
    <footer className={styles.rightsReservedContainer}>
      <p className={styles.rightsReservedText}>
        © {new Date().getFullYear()} All Rights Reserved | LibrarySpace
      </p>
    </footer>
  );
}
