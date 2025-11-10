import styles from "../Styles/PresentDay.module.css";
export default function PresentDay() {
  const d = new Date();
  return (
    <time className={styles.mainPresentday}>
      <span className={styles.date}>
        Date: {`${d.getDate()} / ${d.getMonth()} / ${d.getFullYear()}`}
      </span>
      <span className={styles.day}>
        Day:{" "}
        {d.getDay() == 1
          ? "Monday"
          : d.getDay() == 2
          ? "Tuesday"
          : d.getDay() == 3
          ? "Wednesday"
          : d.getDay() == 4
          ? "Thursday"
          : d.getDay() == 5
          ? "Friday"
          : d.getDay() == 6
          ? "Saturday"
          : "Sunday"}
      </span>
    </time>
  );
}
