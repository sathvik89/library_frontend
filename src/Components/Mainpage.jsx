import React from "react";
import styles from "../Styles/Mainpage.module.css";
import RU from "../BookImages/RUimage.png";

export default function Mainpage() {
  return (
    <main className={styles.mainPageContainer}>
      <section>
        <img className={styles.RUimage} src={RU} alt="" />
        <h1 className={styles.welcomeHeading}>
          Welcome to the Library Management System
        </h1>
        

        <p className={styles.welcomeMessage}>
          Explore our vast collection of books, manage your account, and stay
          updated with the latest news from the library.
        </p>
      </section>
    </main>
  );
}
