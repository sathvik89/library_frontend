import logo from "@/assets/images/books/RUimage.png";
import icon from "@/assets/images/books/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import styles from "@/Styles/Settings.module.css";
import { useState } from "react";

export default function PrivacyPassword() {
  const navi = useNavigate();
  const password = "password_Dummy_123"; // Default value - will be replaced with backend data
  const [show, setShow] = useState(false);
  const [policy, setPolicy] = useState(true);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      <section className={styles.card}>
        <header className={styles.header}>
          <img src={icon} alt="profile" className={styles.icon} />
          <h2 className={styles.title}>Privacy and password</h2>
        </header>
        <section className={styles.infoList}>
          <div className={styles.infoCard}>
            <span>View Password</span>
            <span>{show ? password : "*".repeat(password.length)}</span>
            <button style={{marginLeft:8}} onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"}</button>
          </div>
          <div className={styles.infoCard}>
            <span>Privacy and policy</span>
            <span style={{color: policy ? 'green' : 'red', fontWeight:600}}>{policy ? "accepted ✅" : "not accepted ❌"}</span>
            <button style={{marginLeft:8}} onClick={() => setPolicy(p => !p)}>{policy ? "Dissagree" : "Accept"}</button>
          </div>
        </section>
        <div className={styles.buttonSection}>
          <button className={styles.goBackButton} onClick={() => navi("/settings")}>Go Back</button>
        </div>
      </section>
    </main>
  );
} 