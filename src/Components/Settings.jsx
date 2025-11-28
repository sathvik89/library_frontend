import { useEffect, useState } from "react";
import styles from "../Styles/Settings.module.css";
import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { useNavigate } from "react-router-dom";
import { Modal, Switch } from "antd";
import { toast } from 'react-hot-toast';
import Logoutbutton from "./Logoutbutton";
import { getCurrentUser } from "../api/services/authService";
import { updateUser } from "../api/services/userService";

export default function Settings() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const [notiOn, setNotiOn] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [passError, setPassError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const validatePassword = () => {
    setPassError("");

    if (!currentPass || !newPass || !rePass) {
      setPassError("Please fill all fields");
      toast.error("Please fill all fields");
      return false;
    }

    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters long");
      toast.error("New password must be at least 6 characters long");
      return false;
    }

    if (newPass !== rePass) {
      setPassError("New passwords do not match");
      toast.error("New passwords do not match");
      return false;
    }

    if (currentPass === newPass) {
      setPassError("New password must be different from current password");
      toast.error("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handleSavePass = async () => {
    if (!validatePassword()) {
      return;
    }

    if (!user) {
      toast.error("User data not loaded. Please try again.");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        currentPassword: currentPass,
        password: newPass,
      };

      const response = await updateUser(user.userID, updateData);

      if (response.data?.success) {
        toast.success(response.data.message || "Password updated successfully!");
        setShowPass(false);
        setCurrentPass("");
        setNewPass("");
        setRePass("");
        setPassError("");
      } else {
        toast.error(response.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMsg = error?.response?.data?.message || "Failed to update password. Please try again.";
      setPassError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };
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
          <button className={styles.optionButton} onClick={() => navigate("/settings/account")}>Manage your account</button>
          <button className={styles.optionButton} onClick={() => navigate("/settings/subscription")}>subscription details</button>
          <button className={styles.optionButton} onClick={() => setShowNoti(true)}>Notifications</button>
          <button className={styles.optionButton} onClick={() => setShowPass(true)}>Change password</button>
          <button className={styles.optionButton} onClick={() => navigate("/settings/privacy")}>Privacy and password</button>
        </nav>
        <div className={styles.buttonSection}>
        <button className={styles.goBackButton} onClick={() => navigate("/studentDashboard")}>Go Back</button>  
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
              <input 
                type="password" 
                value={currentPass} 
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                disabled={saving}
                style={{marginLeft:8}} 
              />
            </div>
            <div className={styles.infoCard}>
              <span>New Password</span>
              <input 
                type="password" 
                value={newPass} 
                onChange={e => setNewPass(e.target.value)}
                placeholder="Enter new password"
                disabled={saving}
                style={{marginLeft:8}} 
              />
            </div>
            <div className={styles.infoCard}>
              <span>Re-enter New Password</span>
              <input 
                type="password" 
                value={rePass} 
                onChange={e => setRePass(e.target.value)}
                placeholder="Confirm new password"
                disabled={saving}
                style={{marginLeft:8}} 
              />
            </div>
            {passError && <div style={{color:'red', marginLeft:'1rem', marginTop:'8px'}}>{passError}</div>}
          </section>
          <div className={styles.buttonSection}>
            <button 
              className={styles.goBackButton} 
              onClick={() => {
                setShowPass(false);
                setCurrentPass("");
                setNewPass("");
                setRePass("");
                setPassError("");
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              className={styles.saveButton} 
              onClick={handleSavePass}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}