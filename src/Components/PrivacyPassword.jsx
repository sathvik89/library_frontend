import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Settings.module.css";
import { useContext, useEffect, useState } from "react";
import { profileDetails } from "../context/ProfileContext";

export default function PrivacyPassword() {
  const navi = useNavigate();
  const { password, handlePasswordChange } = useContext(profileDetails);
  const [show, setShow] = useState(false);
  const [policy, setPolicy] = useState(true);
  const [changeMode, setChangeMode] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");

  function handleSave() {
    if (newPass && newPass === rePass) {
      handlePasswordChange({ target: { value: newPass } });
      setChangeMode(false);
      setNewPass("");
      setRePass("");
      
    }
  }
  // useEffect(() => {
  //   setChangeMode(false);
  // }, [changeMode]);

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
        {!changeMode ? (
          <>
            <section className={styles.infoList}>
              <div className={styles.infoCard}>
                <span>View password <span role="img" aria-label="eye">👁️</span></span>
                <span>{show ? password : "*".repeat(password.length)}</span>
                <button style={{marginLeft:8}} onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"}</button>
              </div>
              <div className={styles.infoCard}>
                <span>Change password</span>
                <button style={{marginLeft:8}} onClick={() => setChangeMode(true)}>Click</button>
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
          </>
        ) : (
          <>
            <section className={styles.infoList}>
              <div className={styles.infoCard}>
                <span>Current Password</span>
                <input type="password" value={password} disabled style={{marginLeft:8}} />
              </div>
              <div className={styles.infoCard}>
                <span>New Password</span>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} style={{marginLeft:8}} />
              </div>
              <div className={styles.infoCard}>
                <span>Re-enter New Password</span>
                <input type="password" value={rePass} onChange={e => setRePass(e.target.value)} style={{marginLeft:8}} />
              </div>
            </section>
            <div className={styles.buttonSection}>
              <button className={styles.goBackButton} onClick={() => setChangeMode(false)}>Go Back</button>
              <button className={styles.saveButton} onClick={handleSave}>Save</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
} 