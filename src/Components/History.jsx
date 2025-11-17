import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import book1 from "../BookImages/book1.png";
import book2 from "../BookImages/book2.png";
import styles from "../Styles/History.module.css";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navi = useNavigate();
  
  const recents = [
    {
      image: book1,
      title: "Brick by Brick",
      borrowDate: "25/3/2024",
      returnDate: "30/3/2024",
      bookId: "#24rtd",
      author: "Manish Vij",
    },
    {
      image: book2,
      title: "The Coded Labyrinth",
      borrowDate: "23/1/2022",
      returnDate: "1/2/2022",
      bookId: "#19clb",
      author: "Aarav Mehta",
    },
  ];
  const hisbooks = [
    { name: "Whispers of the Horizon", borrow: "12/2/2023", return: "Due" },
    { name: "The Coded Labyrinth", borrow: "23/1/2022", return: "1/2/2022" },
  ];
  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="rishihood university logo" className={styles.logo} />
      </div>
      <section className={styles.historyCard}>
        <header className={styles.headerSection}>
          <img src={icon} alt="profile" className={styles.profileIcon} />
          <h2 className={styles.headerTitle}>Your History</h2>
        </header>
        <div className={styles.recentsLabel}>Recents:-</div>
        <div className={styles.recentsScroll}>
          {recents.map((b, idx) => (
            <article className={styles.recentCard} key={idx}>
              <img src={b.image} alt={b.title} className={styles.bookImage} />
              <div className={styles.bookDetails}>
                <div className={styles.bookTitle}>{b.title}</div>
                <div className={styles.bookMeta}>Borrow Date:- {b.borrowDate}</div>
                <div className={styles.bookMeta}>Return Date:- {b.returnDate}</div>
                <div className={styles.bookMeta}>Book Id:- {b.bookId}</div>
                <div className={styles.bookMeta}>Author:- {b.author}</div>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Borrow Date</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {hisbooks.map((row, idx) => (
                <tr key={idx} className={styles.tableRow}>
                  <td>{row.name}</td>
                  <td>{row.borrow}</td>
                  <td>{row.return}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonSection}>
          <button className={styles.goBackButton} onClick={() => navi("/studentDashboard")}>Go Back</button>
        </div>
      </section>
    </main>
  );
}
