import { useState } from "react";
import { BookOutlined } from "@ant-design/icons";
import styles from "@/Styles/BookCoverThumb.module.css";

/**
 * Small cover image for table rows. Falls back to a drawn placeholder when a
 * book has no cover, or when the remote image fails to load.
 */
export default function BookCoverThumb({ src, alt = "" }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div className={styles.thumb}>
      {show ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <BookOutlined className={styles.icon} />
      )}
    </div>
  );
}
