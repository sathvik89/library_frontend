import React from "react";
import styles from "../Styles/News.module.css";

export default function News() {
  const newstoday = [
    {
      title: "Breaking: New advancements in renewable energy technology!",
      link: "https://www.hindustantimes.com",
      source: "Hindustan Times",
    },
    {
      title: "Global markets see a surge in green investments.",
      link: "https://www.bloomberg.com",
      source: "Bloomberg",
    },
  ];

  return (
    <section className={styles.newsMain}>
      <h2 className={styles.titleNews}>Today's Top Headlines</h2>
      <div className={styles.newsList}>
        {newstoday.map((item, index) => (
          <article key={index} className={styles.newsItem}>
            <p className={styles.newsToday}>{item.title}</p>
            <p className={styles.newsReadMore}>
              Read more:{" "}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.newsLink}
              >
                {item.source}
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
