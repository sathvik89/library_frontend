import { Card } from "antd";
import { BookOutlined } from "@ant-design/icons";
import styles from "../Styles/BookCard.module.css";

const { Meta } = Card;

function BookCard({ book, onCardClick }) {
  const handleClick = () => {
    onCardClick(book);
  };
  const imageUrl = book.coverImg || "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <Card
      hoverable
      className={styles.bookCard}
      cover={
        <div className={styles.imageContainer}>
          <img
            alt={book.title}
            src={imageUrl}
            className={styles.bookImage}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
            }}
          />
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
            <div className={styles.author}>
              <strong>Author:</strong> {book.authorName || "N/A"}
            </div>
            <div className={styles.genre}>
              <BookOutlined /> {book.genre || "N/A"}
            </div>
            <div className={styles.availability}>
              <span className={book.availableCopies > 0 ? styles.available : styles.unavailable}>
                {book.availableCopies > 0
                  ? `${book.availableCopies} Available`
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
}

export default BookCard;

