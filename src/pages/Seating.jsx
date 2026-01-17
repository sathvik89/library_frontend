import { useNavigate } from "react-router-dom";
import PreviousButton from "@/components/common/PreviousButton";
import styles from "@/Styles/Seating.module.css";
import RU from "@/assets/images/books/RUimage.png";
export default function Seating({ available }) {
  const navigate = useNavigate();

  return (
    <main className={styles.seatingMain}>
      <section>
        <img src={RU} alt="" className={styles.image} />

        <div className={styles.seatinginner}>
          <h1 className={styles.mainCount}>Total Seats Available: 220</h1>
          <h3 className={styles.remainCount}>
            Remaining seats : {available}/220
          </h3>
          Want to reserve your seat ?
          <button
            className={styles.reserveButton}
            onClick={() => navigate("/reserveseat")}
          >
            Reserve Seat
          </button>
        </div>
        <PreviousButton />
      </section>
    </main>
  );
}
