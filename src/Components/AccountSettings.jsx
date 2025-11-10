import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Settings.module.css";

export default function AccountSettings() {
  const navi = useNavigate();
  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      <section className={styles.card}>
        <header className={styles.header}>
          <img src={icon} alt="profile" className={styles.icon} />
          <h2 className={styles.title}>Your Account</h2>
        </header>
        <section className={styles.infoList}>
          <div className={styles.infoCard}>
            Account Verification <span style={{color: 'green', fontSize: '1.3em'}}>Verified ✅</span>
          </div>
          <div className={styles.infoCard}>
            Regional Settings <span style={{color: '#a51c30', fontWeight: 600}}>Asia 🌏</span>
          </div>
          <div className={styles.infoCard}>
            Language <span style={{color: '#a51c30', fontWeight: 600}}>English</span>
          </div>
        </section>
        <div className={styles.buttonSection}>
          <button className={styles.goBackButton} onClick={() => navi("/settings")}>Go Back</button>
        </div>
      </section>
    </main>
  );
} 