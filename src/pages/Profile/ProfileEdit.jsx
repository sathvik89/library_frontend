import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { toast } from 'react-hot-toast';
import styles from "@/Styles/ProfileEdit.module.css";
import logo from "@/assets/images/books/RUimage.png";
import icon from "@/assets/images/books/ProfileIcon.png";
import { getCurrentUser } from "@/api/services/authService";
import { updateUser } from "@/api/services/userService";

export default function ProfileEdit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      if (response.data) {
        const userData = response.data;
        setUser(userData);
        setUserName(userData.userName || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setRollNo(userData.rollNo ? String(userData.rollNo) : "");
      } else {
        toast.error("Failed to load user data");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorMsg = error?.response?.data?.message || "Failed to load user data. Please try again.";
      toast.error(errorMsg);
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!userName || userName.trim() === "") {
      toast.error("Username is required");
      return false;
    }

    if (!email || email.trim() === "") {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const updateData = {};

      if (userName !== user.userName) {
        updateData.userName = userName.trim();
      }

      if (email !== user.email) {
        updateData.email = email.trim();
      }

      const currentPhone = user.phone ? String(user.phone).trim() : "";
      const newPhone = phone.trim();
      if (newPhone !== currentPhone) {
        updateData.phone = newPhone || null;
      }

      const currentRollNo = user.rollNo ? String(user.rollNo) : "";
      if (rollNo !== currentRollNo) {
        if (rollNo.trim()) {
          const rollNoNum = Number(rollNo.trim());
          if (isNaN(rollNoNum) || rollNoNum < 0) {
            toast.error("Please enter a valid roll number");
            return;
          }
          updateData.rollNo = rollNoNum;
        } else {
          updateData.rollNo = null;
        }
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      console.log("Sending update data:", updateData);
      const response = await updateUser(user.userID, updateData);
      console.log("Update response:", response.data);

      if (response.data?.success) {
        toast.success(response.data.message || "Profile updated successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error?.response?.data?.message || "No Updates made to the profile. Please try changing the fields.";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
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
          <p>Unable to load user data. Please try again later.</p>
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
          <h2 className={styles.profileTitle}>Edit Profile</h2>
        </header>

        <section className={styles.formSection}>
          <div className={styles.formGroup}>
            <label htmlFor="userName" className={styles.label}>Username:</label>
            <input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={styles.input}
              type="text"
              placeholder="Enter username"
              disabled={saving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              type="email"
              placeholder="Enter email"
              disabled={saving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone:</label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              type="tel"
              placeholder="Enter phone number (optional)"
              disabled={saving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rollNo" className={styles.label}>Roll Number:</label>
            <input
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className={styles.input}
              type="text"
              placeholder="Enter roll number (optional)"
              disabled={saving}
            />
          </div>
        </section>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
