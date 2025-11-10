import styles from "../Styles/Settings.module.css";
import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal, Switch } from "antd";
import { profileDetails } from "../context/ProfileContext";
import { useEffect } from "react";
import { toast } from 'react-hot-toast';
import Logoutbutton from "./Logoutbutton";

export default function Settings() {
  const navi = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const [notiOn, setNotiOn] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { password, handlePasswordChange } = useContext(profileDetails);
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [passError, setPassError] = useState("");

  function handleSavePass() {
    if (!newPass || !rePass) {
      setPassError("Please fill both fields");
      toast.error("Please fill both fields");
      return;
    }
    if (newPass !== rePass) {
      setPassError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    handlePasswordChange({ target: { value: newPass } });
    setShowPass(false);
    setNewPass("");
    setRePass("");
    setPassError("");
    toast.success("Password changed successfully!");
  }
  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logouni" className={styles.logo} />
      </div>
      <section className={styles.card}>
        <header className={styles.header}>
          <img src={icon} alt="profile" className={styles.icon} />
          <h2 className={styles.title}>Settings</h2>
        </header>
        <nav className={styles.options}>
          <button className={styles.optionButton} onClick={() => navi("/settings/account")}>Manage your account</button>
          <button className={styles.optionButton} onClick={() => navi("/settings/subscription")}>subscription details</button>
          <button className={styles.optionButton} onClick={() => setShowNoti(true)}>Notifications</button>
          <button className={styles.optionButton} onClick={() => setShowPass(true)}>Change password</button>
          <button className={styles.optionButton} onClick={() => navi("/settings/privacy")}>Privacy and password</button>
        </nav>
        <div className={styles.buttonSection}>
        <button className={styles.goBackButton} onClick={() => navi("/home")}>Go Back</button>
        <Logoutbutton/>
          
        </div>
      </section>
      {/* notifications */}
      <Modal open={showNoti} onCancel={() => setShowNoti(false)} footer={null} width={400} maskClosable={true}>
        <div className={styles.card} style={{margin:'2rem auto'}}>
          <header className={styles.header}>
            <img src={icon} alt="profile" className={styles.icon} />
            <h2 className={styles.title}>Notifications</h2>
          </header>
          <section className={styles.notificationCard}>
            <span style={{fontWeight:600, fontSize:'1.1em'}}>Notifications :</span>
            <Switch
              checked={notiOn}
              onChange={val => { setNotiOn(val); }}
              checkedChildren="On"
              unCheckedChildren="Off"
              style={{marginLeft:16, background: notiOn ? '#a51c30' : '#ccc'}}
            />
          </section>
          <div className={styles.buttonSection}>
            <button className={styles.goBackButton} onClick={() => setShowNoti(false)}>Close</button>
          </div>
        </div>
      </Modal>
      {/* password */}
      <Modal open={showPass} onCancel={() => setShowPass(false)} footer={null} width={400} maskClosable={true}>
        <div className={styles.card} style={{margin:'2rem auto'}}>
          <header className={styles.header}>
            <img src={icon} alt="profile" className={styles.icon} />
            <h2 className={styles.title}>Change Password</h2>
          </header>
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
            {passError && <div style={{color:'red', marginLeft:'1rem'}}>{passError}</div>}
          </section>
          <div className={styles.buttonSection}>
            <button className={styles.goBackButton} onClick={() => setShowPass(false)}>Cancel</button>
            <button className={styles.saveButton} onClick={handleSavePass}>Save</button>
          </div>
        </div>
      </Modal>
    </main>
  );
}