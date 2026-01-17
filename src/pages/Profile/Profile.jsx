import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import { toast } from "react-hot-toast";
import logo from "@/assets/images/books/RUimage.png";
import icon from "@/assets/images/books/ProfileIcon.png";
import styles from "@/Styles/ProfileSection.module.css";
import PreviousButton from "@/components/common/PreviousButton";
import { getCurrentUser } from "@/api/services/authService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      const errorMsg = error?.response?.data?.message || "Failed to load profile. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate("/profileEdit");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "LIBRARIAN":
        return "blue";
      case "STUDENT":
        return "green";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <main className={styles.mainContainer}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh" 
        }}>
          <Spin size="large" tip="Loading profile..." />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.mainContainer}>
        <div className={styles.profileCard}>
          <p>Unable to load profile data. Please try again later.</p>
        </div>
      </main>
    );
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

        <div className={styles.nameSection}>{user.userName || "N/A"}</div>

        <section className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>User ID:</span>
            <Tag color="cyan">{user.userID || "N/A"}</Tag>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Role:</span>
            <Tag color={getRoleColor(user.role)}>{user.role || "N/A"}</Tag>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            {user.email || "Not provided"}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Phone:</span>
            {user.phone || "Not provided"}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Roll Number:</span>
            {user.rollNo ? String(user.rollNo) : "Not provided"}
          </div>
        </section>

        <div className={styles.buttonGroup}>
          <button className={styles.goBackButton} onClick={() => navigate("/studentDashboard")}>
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
