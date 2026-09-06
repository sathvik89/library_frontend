import { useState } from "react";
import { Button, Empty, Popconfirm } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { cancelReservation } from "@/api/services/reservationService";
import styles from "@/Styles/MyLoans.module.css";

// Books this person has asked for but not collected yet.
export default function MyReservations({ reservations, onChanged }) {
  const [cancelling, setCancelling] = useState(null);

  const waiting = (reservations || []).filter((r) => r.isActive);

  const handleCancel = async (reservation) => {
    setCancelling(reservation.reservationID);
    try {
      const res = await cancelReservation(reservation.reservationID);
      toast.success(res.data.message);
      onChanged?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not cancel it.");
    } finally {
      setCancelling(null);
    }
  };

  if (waiting.length === 0) {
    return (
      <div className={styles.stateBox}>
        <Empty
          description={
            <>
              You have not reserved anything.
              <br />
              <span className={styles.hint}>
                Find a book in the catalogue and press Reserve.
              </span>
            </>
          }
        />
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {waiting.map((r) => (
        <li key={r.reservationID} className={styles.item}>
          <div className={styles.cover}>
            {r.catalog?.coverImg ? (
              <img src={r.catalog.coverImg} alt="" loading="lazy" />
            ) : (
              <BookOutlined className={styles.coverIcon} />
            )}
          </div>

          <div className={styles.body}>
            <strong className={styles.title}>{r.catalog?.title}</strong>
            <span className={styles.author}>{r.catalog?.authorName}</span>
            <span className={styles.due}>
              {r.queuePosition > 1
                ? `You are number ${r.queuePosition} in the queue`
                : "Ready to collect from the desk"}
            </span>
          </div>

          <Popconfirm
            title="Cancel this reservation?"
            okText="Yes, cancel"
            cancelText="Keep it"
            onConfirm={() => handleCancel(r)}
          >
            <Button size="small" loading={cancelling === r.reservationID}>
              Cancel
            </Button>
          </Popconfirm>
        </li>
      ))}
    </ul>
  );
}
