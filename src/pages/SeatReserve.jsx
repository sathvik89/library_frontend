import { toast } from 'react-hot-toast';

import PreviousButton from "@/components/common/PreviousButton";
import styles from "@/Styles/SeatReserve.module.css";
import RU from "@/assets/images/books/RUimage.png";
export default function ReserveSeat({ onClick, reserve }) {
  function handleReserve() {
    try {
      onClick();
      toast.success("Seat reserved successfully!");
    } catch (e) {
      toast.error("Failed to reserve seat.");
    }
  }
  return (
    <main className={styles.mainreserve}>
      <section>
        <img src={RU} alt="" className={styles.imagemin} />
        <div className={styles.reserveInner}>
          You can only reserve 1 seat ‼️
          {reserve ? (
            <h1 className={styles.reserveTitle}>
              🎉You have confirmed your seat in the library 🥳
            </h1>
          ) : (
            <div className={styles.nonReserveTitle}>
              <p>click below to reserve ur seat !!</p>
              <button onClick={handleReserve}>Reserve seat</button>
            </div>
          )}
        </div>
        <PreviousButton />
      </section>
    </main>
  );
}
