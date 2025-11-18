// import { useNavigate } from "react-router-dom";
import styles from "../Styles/ProfileList.module.css";
import { useContext } from "react";
import { myMenuContext } from "./Home";
import Navi from "./Navi";
import { useNavigate } from "react-router-dom";
import { UserOutlined, CreditCardOutlined, HistoryOutlined, SettingOutlined } from "@ant-design/icons";

export default function ProfileList() {
  const funci = useContext(myMenuContext);
  const navigate = useNavigate();
  return (
    <nav
      className={styles.mainMenuContainer}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "93.5vh",
      }}
    >
      <div className={styles.mainMenuContainer}>
        <div className={styles.popupCard}>
          <div className={styles.closeButton}>
            <button onClick={funci.handleShow}>X</button>
          </div>
          <nav className={styles.Quickoptions}>
            <button onClick={() => navigate("/profile")}>
              <UserOutlined /> Profile
            </button>
            <button onClick={() => navigate("/billings")}>
              <CreditCardOutlined /> Billing and Payments
            </button>
            <button onClick={() => navigate("/history")}>
              <HistoryOutlined /> Manage History
            </button>
            <button onClick={() => navigate("/settings")}>
              <SettingOutlined /> Settings
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
