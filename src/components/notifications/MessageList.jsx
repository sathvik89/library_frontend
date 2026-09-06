import styles from "@/Styles/NotificationBell.module.css";

// "2 hours ago", "Yesterday", "12 Sept" — whichever reads most naturally.
export function whenText(date) {
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

export const MESSAGE_KIND = {
  BOOKING_REMINDER: { label: "Reservation", className: "kindReservation" },
  DUE_REMINDER: { label: "Your books", className: "kindBooks" },
  ANNOUNCEMENT: { label: "Library news", className: "kindNews" },
};

// Shared by the bell and the dashboard section, so both look and behave alike.
export default function MessageList({ items, onRead }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const kind = MESSAGE_KIND[item.type] ?? MESSAGE_KIND.ANNOUNCEMENT;
        return (
          <li
            key={item.notificationID}
            className={`${styles.item} ${item.isRead ? "" : styles.itemNew}`}
            onClick={() => onRead?.(item)}
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
      })}
    </ul>
  );
}
