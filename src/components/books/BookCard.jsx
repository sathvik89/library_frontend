import { Card } from "antd";
import { BookOutlined } from "@ant-design/icons";
import styles from "@/Styles/BookCard.module.css";

const { Meta } = Card;

function BookCard({ book, onCardClick }) {
  const handleClick = () => {
    onCardClick(book);
  };

  // 4 of the seeded titles have no cover. Draw the fallback ourselves rather
  // than leaning on an external placeholder service that may not load.
  const cover = book.coverImg ? (
    <img
      alt={book.title}
      src={book.coverImg}
      className={styles.bookImage}
      loading="lazy"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.classList.add(styles.noCover);
      }}
    />
  ) : null;

  return (
    <Card
      hoverable
      className={styles.bookCard}
      cover={
        <div
          className={`${styles.imageContainer} ${cover ? "" : styles.noCover}`}
        >
          {cover}
          <BookOutlined className={styles.coverFallbackIcon} />
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={
          <div className={styles.title} title={book.title}>
            {book.title}
          </div>
        }
        description={
          <div className={styles.metaContent}>
            <div className={styles.author}>{book.authorName || "Unknown author"}</div>
            <div className={styles.genre}>
              <BookOutlined /> {(book.genre || "N/A").replace(/_/g, " ")}
            </div>
            <div className={styles.availability}>
              <span
                className={
                  book.availableCopies > 0 ? styles.available : styles.unavailable
                }
              >
                {book.availableCopies > 0
                  ? `${book.availableCopies} available`
                  : "All copies out"}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
}

export default BookCard;
