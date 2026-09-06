import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Drawer, Empty, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/services/notificationService";
import styles from "@/Styles/NotificationBell.module.css";

// "2 hours ago", "Yesterday", "12 Sept" — whichever reads most naturally.
function whenText(date) {
  const then = new Date(date);
  const mins = Math.round((Date.now() - then) / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;

  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return then.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

const KIND = {
  BOOKING_REMINDER: { label: "Reservation", className: "kindReservation" },
  DUE_REMINDER: { label: "Your books", className: "kindBooks" },
  ANNOUNCEMENT: { label: "Library news", className: "kindNews" },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      if (res.data?.success) {
        setItems(res.data.data || []);
        setUnread(res.data.unread || 0);
      }
    } catch {
      /* the empty state covers this */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh while the tab is being looked at, so a message that arrives after
  // the librarian acts shows up without a page reload.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 60000);
    return () => clearInterval(id);
  }, [load]);

  const openDrawer = () => {
    setOpen(true);
    load();
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {
      toast.error("Could not mark your messages as read.");
    }
  };

  const handleRead = async (item) => {
    if (item.isRead) return;
    try {
      await markNotificationRead(item.notificationID);
      setItems((prev) =>
        prev.map((n) =>
          n.notificationID === item.notificationID ? { ...n, isRead: true } : n
        )
      );
      setUnread((n) => Math.max(0, n - 1));
    } catch {
      /* leaving it unread is harmless */
    }
  };

  const fresh = items.filter((n) => !n.isRead);
  const earlier = items.filter((n) => n.isRead);

  const renderItem = (item) => {
    const kind = KIND[item.type] ?? KIND.ANNOUNCEMENT;
    return (
      <li
        key={item.notificationID}
        className={`${styles.item} ${item.isRead ? "" : styles.itemNew}`}
        onClick={() => handleRead(item)}
      >
        <div className={styles.itemHead}>
          <span className={`${styles.kind} ${styles[kind.className]}`}>
            {kind.label}
          </span>
          <span className={styles.when}>{whenText(item.scheduledTime)}</span>
        </div>
        <p className={styles.message}>{item.messagePayload}</p>
      </li>
    );
  };

  return (
    <>
      <button
        className={styles.bell}
        onClick={openDrawer}
        aria-label={unread > 0 ? `${unread} unread messages` : "Messages"}
      >
        <Badge count={unread} size="small" offset={[2, -2]}>
          <BellOutlined className={styles.bellIcon} />
        </Badge>
      </button>

      <Drawer
        title="Your messages"
        placement="right"
        width={380}
        open={open}
        onClose={() => setOpen(false)}
        extra={
          unread > 0 ? (
            <Button size="small" onClick={handleReadAll}>
              Mark all read
            </Button>
          ) : null
        }
      >
        {loading ? (
          <div className={styles.centre}>
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <div className={styles.centre}>
            <Empty
              description={
                <>
                  Nothing yet.
                  <br />
                  <span className={styles.hint}>
                    We will write here when a book is ready, due back, or your
                    reservation changes.
                  </span>
                </>
              }
            />
          </div>
        ) : (
          <>
            {fresh.length > 0 && (
              <section className={styles.group}>
                <h4 className={styles.groupTitle}>New</h4>
                <ul className={styles.list}>{fresh.map(renderItem)}</ul>
              </section>
            )}
            {earlier.length > 0 && (
              <section className={styles.group}>
                <h4 className={styles.groupTitle}>Earlier</h4>
                <ul className={styles.list}>{earlier.map(renderItem)}</ul>
              </section>
            )}
          </>
        )}
      </Drawer>
    </>
  );
}
