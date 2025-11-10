import { useState } from "react";
import styles from "../Styles/Ebook.module.css";
export default function Ebook() {
  const [searchQuery, setSearchQuery] = useState("");
  // dummybooksdata

  const digitalBooks = [
    {
      id: 1,
      name: "The Art of Computer Programming",
      description:
        "A comprehensive monograph written by Donald Knuth that covers many kinds of programming algorithms.",
      link: "https://example.com/the-art-of-computer-programming",
    },
    {
      id: 2,
      name: "Clean Code",
      description:
        "A handbook of agile software craftsmanship by Robert C. Martin.",
      link: "https://example.com/clean-code",
    },
    {
      id: 3,
      name: "Introduction to Algorithms",
      description:
        "A book by Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, widely used as a textbook for algorithms courses.",
      link: "https://example.com/introduction-to-algorithms",
    },
    {
      id: 4,
      name: "You Don't Know JS",
      description:
        "A series of books diving deep into the core mechanisms of the JavaScript language.",
      link: "https://example.com/you-dont-know-js",
    },
  ];

  const filteredBooks = digitalBooks.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>E-books Available</h1>

      <input
        className={styles.inputStyles}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a book..."
      />

      {filteredBooks.length > 0 ? (
        filteredBooks.map((book) => (
          <article key={book.id} className={styles.bookCard}>
            <h2 className={styles.bookTitle}>{book.name}</h2>
            <p className={styles.bookDescription}>{book.description}</p>
            <a href={book.link} className={styles.bookLink}>
              Download PDF
            </a>
          </article>
        ))
      ) : (
        <p className={styles.noResultsMessage}>
          Sorry, no book with title "{searchQuery}" is available.
        </p>
      )}
    </section>
  );
}
