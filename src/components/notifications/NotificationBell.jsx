import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Drawer, Empty, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/services/notificationService";
import MessageList from "@/components/notifications/MessageList";
import styles from "@/Styles/NotificationBell.module.css";

export default function NotificationBell() {
  const navigate = useNavigate();
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
                <MessageList items={fresh.slice(0, 5)} onRead={handleRead} />
              </section>
            )}
            {earlier.length > 0 && (
              <section className={styles.group}>
                <h4 className={styles.groupTitle}>Earlier</h4>
                <MessageList items={earlier.slice(0, 3)} />
              </section>
            )}

            <Button
              block
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
            >
              See all notifications
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
}
