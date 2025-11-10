import styles from "../Styles/Rules.module.css";
export default function Rules() {
  return (
    <section className={styles.mainrule}>
      <h1>Library Rules</h1>
      <ul>
        <li>Maintain silence at all times inside the library.</li>
        <li>No food or drinks allowed in the reading area.</li>
        <li>
          No loud conversations or group discussions allowed in the common study
          room.
        </li>
        <li>Books must be returned by the due date to avoid fines.</li>
        <li>
          Strict dress code: No shorts or sleeveless shirts or tops allowed.
        </li>
      </ul>
    </section>
  );
}
