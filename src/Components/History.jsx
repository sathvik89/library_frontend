import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty } from "antd";
import { toast } from "react-hot-toast";
import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import styles from "../Styles/History.module.css";
import { getCurrentUser } from "../api/services/authService";

export default function History() {
  const navi = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      // API returns user object directly in response.data
      if (response.data) {
        setUser(response.data);
      } else {
        toast.error("Failed to load history data");
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
      const errorMsg = error?.response?.data?.message || "Failed to load history. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Get recent loans (last 2 loans)
  const recents = user?.loans && Array.isArray(user.loans) && user.loans.length > 0
    ? user.loans
        .slice()
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
        .slice(0, 2)
        .map((loan) => ({
          image: loan.bookCopy?.catalog?.coverImg || "https://via.placeholder.com/200x300?text=No+Image",
          title: loan.bookCopy?.catalog?.title || "Unknown Book",
          borrowDate: formatDate(loan.issueDate),
          returnDate: loan.returnDate ? formatDate(loan.returnDate) : formatDate(loan.dueDate),
          bookId: loan.bookCopy?.barcode || "N/A",
          author: loan.bookCopy?.catalog?.authorName || "Unknown Author",
        }))
    : [];

  // Get all loans for table
  const hisbooks = user?.loans && Array.isArray(user.loans) && user.loans.length > 0
    ? user.loans
        .slice()
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
        .map((loan) => ({
          name: loan.bookCopy?.catalog?.title || "Unknown Book",
          borrow: formatDate(loan.issueDate),
          return: loan.returnDate ? formatDate(loan.returnDate) : loan.status === "ACTIVE" ? "Due" : formatDate(loan.dueDate),
        }))
    : [];

  // Get recent reservations (last 2 active reservations)
  const recentReservations = user?.reservations && Array.isArray(user.reservations) && user.reservations.length > 0
    ? user.reservations
        .filter((res) => res.isActive === true && res.status === "ACTIVE")
        .slice()
        .sort((a, b) => (b.reservationID || 0) - (a.reservationID || 0))
        .slice(0, 2)
        .map((reservation) => ({
          image: reservation.catalog?.coverImg || "https://via.placeholder.com/200x300?text=No+Image",
          title: reservation.catalog?.title || "Unknown Book",
          reserveDate: "Reserved", // No date field in reservation object
          queuePosition: reservation.queuePosition ?? "N/A",
          bookId: reservation.catalog?.id || reservation.bookID || "N/A",
          author: reservation.catalog?.authorName || "Unknown Author",
          status: reservation.status || "N/A",
        }))
    : [];

  // Get all reservations for table
  const reservationBooks = user?.reservations && Array.isArray(user.reservations) && user.reservations.length > 0
    ? user.reservations
        .slice()
        .sort((a, b) => (b.reservationID || 0) - (a.reservationID || 0))
        .map((reservation) => ({
          name: reservation.catalog?.title || "Unknown Book",
          reserveDate: "Reserved", // No date field in reservation object
          status: reservation.status || "N/A",
          queuePosition: reservation.queuePosition ?? "N/A",
        }))
    : [];

  if (loading) {
    return (
      <main className={styles.mainContainer}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh"
        }}>
          <Spin size="large" tip="Loading history..." />
        </div>
      </main>
    );
  }
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
        <div className={styles.recentsLabel}>Recent Borrows:-</div>
        <div className={styles.recentsScroll}>
          {recents.length > 0 ? (
            recents.map((b, idx) => (
              <article className={styles.recentCard} key={idx}>
                <img src={b.image} alt={b.title} className={styles.bookImage} onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                }} />
                <div className={styles.bookDetails}>
                  <div className={styles.bookTitle}>{b.title}</div>
                  <div className={styles.bookMeta}>Borrow Date:- {b.borrowDate}</div>
                  <div className={styles.bookMeta}>Return Date:- {b.returnDate}</div>
                  <div className={styles.bookMeta}>Book Id:- {b.bookId}</div>
                  <div className={styles.bookMeta}>Author:- {b.author}</div>
                </div>
              </article>
            ))
          ) : (
            <Empty description="No recent borrows found" style={{ padding: "20px" }} />
          )}
        </div>

        <div className={styles.recentsLabel} style={{ marginTop: "20px" }}>Recent Reservations:-</div>
        <div className={styles.recentsScroll}>
          {recentReservations.length > 0 ? (
            recentReservations.map((b, idx) => (
              <article className={styles.recentCard} key={idx}>
                <img src={b.image} alt={b.title} className={styles.bookImage} onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                }} />
                <div className={styles.bookDetails}>
                  <div className={styles.bookTitle}>{b.title}</div>
                  <div className={styles.bookMeta}>Reserve Date:- {b.reserveDate}</div>
                  <div className={styles.bookMeta}>Queue Position:- {b.queuePosition}</div>
                  <div className={styles.bookMeta}>Book Id:- {b.bookId}</div>
                  <div className={styles.bookMeta}>Author:- {b.author}</div>
                  <div className={styles.bookMeta}>Status:- {b.status}</div>
                </div>
              </article>
            ))
          ) : (
            <Empty description="No recent reservations found" style={{ padding: "20px" }} />
          )}
        </div>
        <div className={styles.tableWrapper}>
          <h3 style={{ marginBottom: "10px" }}>Borrow History</h3>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Borrow Date</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {hisbooks.length > 0 ? (
                hisbooks.map((row, idx) => (
                  <tr key={idx} className={styles.tableRow}>
                    <td>{row.name}</td>
                    <td>{row.borrow}</td>
                    <td>{row.return}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    <Empty description="No borrow history found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableWrapper} style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Reservation History</h3>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reserve Date</th>
                <th>Queue Position</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservationBooks.length > 0 ? (
                reservationBooks.map((row, idx) => (
                  <tr key={idx} className={styles.tableRow}>
                    <td>{row.name}</td>
                    <td>{row.reserveDate}</td>
                    <td>{row.queuePosition}</td>
                    <td>{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    <Empty description="No reservation history found" />
                  </td>
                </tr>
              )}
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
