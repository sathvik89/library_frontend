import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import styles from "../Styles/ProfileSection.module.css";
import PreviousButton from "./PreviousButton";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { profileDetails } from "../context/ProfileContext";

export default function Profile() {
  const {name,phone,email,address} = useContext(profileDetails)
  const navi = useNavigate();
  function handleEdit() {
    navi("/profileEdit");
  }
  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="University Logo" className={styles.logo} />
      </div>

      <section className={styles.profileCard}>
        <header className={styles.profileHeader}>
          <img src={icon} alt="Profile Icon" className={styles.profileIcon} />
          <h2 className={styles.profileTitle}>Profile</h2>
        </header>

        <div className={styles.nameSection}>{name}</div>

        <section className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Phone no:</span>
            {phone}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span> {email}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Address:</span> {address}
          </div>
        </section>
<div className={styles.buttonGroup}>
   <button className={styles.goBackButton} onClick={() => navi("/studentDashboard")}> 
    Go back
  </button>
  <button className={styles.editButton} onClick={handleEdit}>
    Edit profile
  </button>
</div>

      </section>
    </main>
  );
}
