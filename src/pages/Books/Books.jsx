import { useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import BookCard from "@/components/books/BookCard";
import BookModal from "@/components/books/BookModal";
import { getAllBooks } from "@/api/services/bookService";
import styles from "@/Styles/Books.module.css";

const LATEST_COUNT = 8;

/** The newest titles in the catalogue. Highest id = most recently added. */
export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAllBooks({
          limit: LATEST_COUNT,
          sortBy: "id_desc",
        });
        if (cancelled) return;
        if (res.data?.success) {
          setBooks(res.data.data || []);
        } else {
          setError(res.data?.message || "Could not load the latest books.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Latest collection error:", err);
        setError(
          err?.response?.data?.message || "Could not load the latest books."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.stateBox}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateBox}>
        <Empty description={error} />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className={styles.stateBox}>
        <Empty description="No books in the catalogue yet." />
      </div>
    );
  }

  return (
    <>
      <div className={styles.BooksList}>
        {books.map((book) => (
          <div className={styles.cardWrap} key={book.id}>
            <BookCard book={book} onCardClick={(b) => setSelectedBookId(b.id)} />
          </div>
        ))}
      </div>

      <BookModal
        bookId={selectedBookId}
        open={selectedBookId !== null}
        onClose={() => setSelectedBookId(null)}
      />
    </>
  );
}
