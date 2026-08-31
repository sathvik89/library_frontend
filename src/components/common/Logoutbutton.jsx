import { useNavigate } from "react-router-dom";
import styles from "@/Styles/Logoutbutton.module.css";
import { toast } from 'react-hot-toast';
import axios from "axios";

/**
 * variant "solid" — for light backgrounds (Settings page)
 * variant "ghost" — for the maroon dashboard top bar
 */
export default function Logoutbutton({ variant = "solid" }) {
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
    <div className={variant === "ghost" ? styles.ghostContainer : styles.logoutContainer}>
      <button
        onClick={handleLogout}
        className={variant === "ghost" ? styles.ghostButton : styles.logoutButton}
      >
        Logout
      </button>
    </div>
  );
}
