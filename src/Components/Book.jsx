import styles from "../Styles/Book.module.css";
export default function Book({ title, description, location, imageURL }) {
  return (
    <article className={styles.mainBook}>
      <h2 className={styles.bookTitle}>{title}</h2>
      <img className={styles.Imagestyle} src={imageURL} alt={title} />
      <p className={styles.bookDesci}>{description}</p>
      <h4 className={styles.bookLocat}>{location}</h4>
    </article>
  );
}
