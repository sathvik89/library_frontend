import logo from "@/assets/images/books/RUimage.png";
import icon from "@/assets/images/books/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import styles from "@/Styles/Settings.module.css";
import { CheckCircleFilled, GlobalOutlined } from "@ant-design/icons";

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
            Account Verification <span style={{color: 'var(--ru-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6}}>
              <CheckCircleFilled /> Verified
            </span>
          </div>
          <div className={styles.infoCard}>
            Regional Settings <span style={{color: 'var(--ru-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6}}>
              <GlobalOutlined /> Asia
            </span>
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