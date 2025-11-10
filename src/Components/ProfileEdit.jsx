import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { profileDetails } from "../context/ProfileContext";
import styles from "../Styles/ProfileEdit.module.css";
import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import { toast } from 'react-hot-toast';

export default function ProfileEdit() {
  const {
    name,
    phone,
    email,
    address,
    handlePhoneChange,
    handleEmailChange,
    handleAddresschange,
    handleNameChange,
  } = useContext(profileDetails);

  const navi = useNavigate();

  function handleCancel() {
    navi("/profile");
  }

  function handleSave() {
    toast.success("Profile updated successfully!");
    navi("/profile");
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
            <label htmlFor="name" className={styles.label}>Name:</label>
            <input
              id="name"
              value={name}
              onChange={handleNameChange}
              className={styles.input}
              type="text"
              placeholder="Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={styles.input}
              type="email"
              placeholder="Email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone:</label>
            <input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className={styles.input}
              type="tel"
              placeholder="Phone"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>Address:</label>
            <input
              id="address"
              value={address}
              onChange={handleAddresschange}
              className={styles.input}
              type="text"
              placeholder="Address"
            />
          </div>
        </section>

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
