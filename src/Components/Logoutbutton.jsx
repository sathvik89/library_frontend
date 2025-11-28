import { useNavigate } from "react-router-dom";
import styles from "../Styles/Logoutbutton.module.css";
import { toast } from 'react-hot-toast';
import axios from "axios";

export default function Logoutbutton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Remove axios authorization header
    delete axios.defaults.headers.common["Authorization"];
    
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <div className={styles.logoutContainer}>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}
