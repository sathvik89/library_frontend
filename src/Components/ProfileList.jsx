// import { useNavigate } from "react-router-dom";
import styles from "../Styles/ProfileList.module.css";
import { useContext } from "react";
import { myMenuContext } from "./Home";
import Navi from "./Navi";
import { useNavigate } from "react-router-dom";

export default function ProfileList() {
  const funci = useContext(myMenuContext);
  const navigate = useNavigate();
  //   const navi = useNavigate();
  //   function handleClose() {
  //     // navi("/home");
  //   }
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
            <button onClick={() => navigate("/profile")}>👤 Profile</button>
            <button onClick={() => navigate("/billings")}>
              💳 Billing and Payments
            </button>
            <button onClick={() => navigate("/history")}>
              📚 Manage History
            </button>
            <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
