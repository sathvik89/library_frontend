import { useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { getAllBooks } from "@/api/services/bookService";
import styles from "@/Styles/Ebook.module.css";

const LIMIT = 8;

/** Catalogue titles that have an ebookLink set (filtered server-side). */
export default function Ebook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAllBooks({
          hasEbook: "true",
          limit: LIMIT,
          sortBy: "title_asc",
        });
        if (cancelled) return;
        if (res.data?.success) {
          setBooks(res.data.data || []);
        } else {
          setError(res.data?.message || "Could not load e-books.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("E-books error:", err);
        setError(err?.response?.data?.message || "Could not load e-books.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Empty
          description={
            <>
              No e-books yet.
              <br />
              <span className={styles.emptyHint}>
                They appear here once a librarian adds an e-book link to a title.
              </span>
            </>
          }
        />
      </div>
    );
  }

  return (
    <section className={styles.container}>
      {books.length > 4 && (
        <input
          className={styles.inputStyles}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search e-books..."
        />
      )}

      {filtered.length > 0 ? (
        filtered.map((book) => (
          <article key={book.id} className={styles.bookCard}>
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.authorName}</p>
            {book.description && (
              <p className={styles.bookDescription}>{book.description}</p>
            )}
            <a
              href={book.ebookLink}
              className={styles.bookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadOutlined /> Open e-book
            </a>
          </article>
        ))
      ) : (
        <p className={styles.noResultsMessage}>
          No e-book matches &quot;{searchQuery}&quot;.
        </p>
      )}
    </section>
  );
}
