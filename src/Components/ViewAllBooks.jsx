import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Styles/ViewAllBooks.module.css";

function ViewAllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get("http://localhost:3001/api/books");
        setBooks(res.data.books || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <h2 className={styles.loading}>Loading books...</h2>;
  if (error) return <h2 className={styles.error}>{error}</h2>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Collection of All Books</h1>

      <div className={styles.booksContainer}>
        {books.map((book) => (
          <article className={styles.bookCard} key={book.id}>
            <img src={book.imageUrl} alt={book.title} />

            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.description}>{book.description}</p>
            <p className={styles.genre}><strong>Genre:</strong> {book.genre}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ViewAllBooks;
