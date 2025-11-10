import styles from "../Styles/Help.module.css";

export default function Help() {
  return (
    <section className={styles.helpmain}>
      <h5>Need help?</h5>
      <p>
        Visit our <a href="/help-center">Help Center</a> or contact the
        librarian.
      </p>
      <p>Contact no: +91 9376402483</p>
      <p>Email: rishihoodLibrary@gmail.com</p>
    </section>
  );
}
