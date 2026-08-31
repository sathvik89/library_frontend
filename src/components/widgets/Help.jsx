import styles from "@/Styles/Help.module.css";

export default function Help() {
  return (
    <section className={styles.helpmain}>
      <p>
        Visit the{" "}
        <a
          href="https://rishihood.edu.in/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rishihood University help centre
        </a>{" "}
        or contact the librarian.
      </p>
      <p>Contact no: +91 9376402483</p>
      <p>Email: rishihoodLibrary@gmail.com</p>
    </section>
  );
}
