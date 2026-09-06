import { useState } from "react";
import logo from "@/assets/images/books/RUimage.png";
import PreviousButton from "@/components/common/PreviousButton";
import MessageHistory from "@/components/notifications/MessageHistory";
import styles from "@/Styles/NotificationsPage.module.css";

// Every message the library has sent you, on a page of its own.
export default function Notifications() {
  const [unread, setUnread] = useState(null);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your account</p>
          <h1 className={styles.heading}>Messages</h1>
          <p className={styles.sub}>
            {unread > 0
              ? `You have ${unread} unread message${unread === 1 ? "" : "s"}.`
              : "Everything the library has told you, newest first."}
          </p>
        </div>
        <img src={logo} alt="" className={styles.logo} />
      </header>

      <div className={styles.card}>
        <MessageHistory onCount={setUnread} full />
      </div>

      <div className={styles.footerRow}>
        <PreviousButton navi="/studentDashboard" text="Back to dashboard" />
      </div>
    </main>
  );
}
