import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Spin } from "antd";
import { BookOutlined } from "@ant-design/icons";
import BookModal from "@/components/books/BookModal";
import { getAllBooks } from "@/api/services/bookService";
import styles from "@/Styles/All.module.css";

const PAGE_SIZE = 6;

/** A browsable slice of the catalogue. Full list lives on /ViewAllBooks. */
export default function Allbooks() {
  const navi = useNavigate();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [failedCovers, setFailedCovers] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAllBooks({
          limit: PAGE_SIZE,
          sortBy: "title_asc",
        });
        if (cancelled) return;
        if (res.data?.success) {
          setBooks(res.data.data || []);
          setTotal(res.data.pagination?.total || 0);
        } else {
          setError(res.data?.message || "Could not load books.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("All books error:", err);
        setError(err?.response?.data?.message || "Could not load books.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const shelfOf = (book) => {
    const shelves = [...new Set((book.bookCopies || []).map((c) => c.shelf))];
    return shelves.length ? shelves.join(", ") : "Shelf not recorded";
  };

  return (
    <section className={styles.containerAllbook}>
      <div className={styles.headerRow}>
        {total > 0 && (
          <span className={styles.countNote}>
            Showing {books.length} of {total}
          </span>
        )}
        <button
          className={styles.viewAllBtn}
          onClick={() => navi("/ViewAllBooks")}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className={styles.stateBox}>
          <Spin />
        </div>
      ) : error ? (
        <div className={styles.stateBox}>
          <Empty description={error} />
        </div>
      ) : books.length === 0 ? (
        <div className={styles.stateBox}>
          <Empty description="No books in the catalogue yet." />
        </div>
      ) : (
        books.map((book) => (
          <article
            key={book.id}
            className={styles.bookCard}
            onClick={() => setSelectedBookId(book.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedBookId(book.id)}
          >
            <div className={styles.bookimages}>
              {book.coverImg && !failedCovers.has(book.id) ? (
                <img
                  src={book.coverImg}
                  alt=""
                  loading="lazy"
                  onError={() =>
                    setFailedCovers((prev) => new Set(prev).add(book.id))
                  }
                />
              ) : (
                <div className={styles.noCover}>
                  <BookOutlined />
                </div>
              )}
            </div>
            <div className={styles.bookdesci}>
              <h2 className={styles.bookTitle}>{book.title}</h2>
              <p className={styles.bookDescription}>
                {book.description || "No description available."}
              </p>
              <p className={styles.bookDetails}>
                <strong>Author:</strong> {book.authorName || "Unknown"} |{" "}
                <strong>Genre:</strong>{" "}
                {(book.genre || "N/A").replace(/_/g, " ")} |{" "}
                <strong>Shelf:</strong> {shelfOf(book)}
              </p>
              <p
                className={
                  book.availableCopies > 0 ? styles.available : styles.unavailable
                }
              >
                {book.availableCopies > 0
                  ? `${book.availableCopies} of ${book.totalCopies} available`
                  : "All copies out"}
              </p>
            </div>
          </article>
        ))
      )}

      <BookModal
        bookId={selectedBookId}
        open={selectedBookId !== null}
        onClose={() => setSelectedBookId(null)}
      />
    </section>
  );
}
