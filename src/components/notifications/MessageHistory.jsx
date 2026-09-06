import { useCallback, useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";
import { toast } from "react-hot-toast";
import MessageList from "@/components/notifications/MessageList";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/services/notificationService";
import styles from "@/Styles/MessageHistory.module.css";

// The full record of what the library has told you, newest first, so nothing
// disappears once it has been read.
export default function MessageHistory({ onCount, full = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      if (res.data?.success) {
        setItems(res.data.data || []);
        onCount?.(res.data.unread || 0);
      }
    } catch {
      /* the empty state covers this */
    } finally {
      setLoading(false);
    }
  }, [onCount]);

  useEffect(() => {
    load();
  }, [load]);

  const readOne = async (item) => {
    if (item.isRead) return;
    try {
      await markNotificationRead(item.notificationID);
      setItems((prev) =>
        prev.map((n) =>
          n.notificationID === item.notificationID ? { ...n, isRead: true } : n
        )
      );
      onCount?.((c) => Math.max(0, (c ?? 1) - 1));
    } catch {
      /* leaving it unread is harmless */
    }
  };

  const readAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onCount?.(0);
    } catch {
      toast.error("Could not mark your messages as read.");
    }
  };

  const unread = items.filter((n) => !n.isRead);
  const earlier = items.filter((n) => n.isRead);

  if (loading) {
    return (
      <div className={styles.stateBox}>
        <Spin />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.stateBox}>
        <Empty
          description={
            <>
              No messages yet.
              <br />
              <span className={styles.hint}>
                We write here when a book is ready, due back, or your reservation
                changes.
              </span>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {unread.length > 0 && (
        <div className={styles.groupHead}>
          <h4 className={styles.groupTitle}>New · {unread.length}</h4>
          <Button size="small" onClick={readAll}>
            Mark all read
          </Button>
        </div>
      )}

      <div className={full ? undefined : styles.scroll}>
        {unread.length > 0 && <MessageList items={unread} onRead={readOne} />}

        {earlier.length > 0 && (
          <>
            <h4 className={`${styles.groupTitle} ${styles.earlierTitle}`}>
              Earlier · {earlier.length}
            </h4>
            <MessageList items={earlier} />
          </>
        )}
      </div>
    </div>
  );
}
