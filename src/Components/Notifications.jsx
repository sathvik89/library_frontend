import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Settings.module.css";
import { useState } from "react";
import { Modal, Switch } from "antd";

export default function Notifications() {
  const navi = useNavigate();
  const [open, setOpen] = useState(true);
  const [enabled, setEnabled] = useState(false);
  function handlebackbutton(){
    setOpen(false);
    navi("/settings");
  }

  return (
    <Modal open={open} footer={null} closable={false} width={400} bodyStyle={{padding:0, background:'#fdf1de'}}>
      {/* <div className={styles.mainContainer}> */}
        <div className={styles.card}>
          <header className={styles.header}>
            <img src={icon} alt="profile" className={styles.icon} />
            <h2 className={styles.title}>Notifications</h2>
          </header>
          <section className={styles.notificationCard}>
            <span style={{fontWeight:600, fontSize:'1.1em'}}>Notifications :</span>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              checkedChildren="On"
              unCheckedChildren="Off"
              style={{marginLeft:16, background: enabled ? '#a51c30' : '#ccc'}}
            />
          </section>
          <div className={styles.buttonSection}>
            <button className={styles.goBackButton} onClick= { handlebackbutton }>Go Back</button>
          </div>
        </div>
      {/* </div> */}
    </Modal>
  );
} 