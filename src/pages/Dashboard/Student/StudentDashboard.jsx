import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Books from "@/pages/Books/Books.jsx";
import Search from "@/components/common/Search.jsx";
import Help from "@/components/widgets/Help.jsx";
import Ebook from "@/components/books/Ebooks.jsx";
import Allbooks from "@/components/books/AllBooks.jsx";
import Rules from "@/components/widgets/Rules.jsx";
import LibraryTimings from "@/components/widgets/LibraryTimings.jsx";
import PresentDay from "@/components/widgets/PresentDay.jsx";
import News from "@/components/widgets/News.jsx";
import ProfileList from "@/pages/Profile/ProfileList.jsx";
import DashboardShell, {
  Section,
  StatCard,
  StatRow,
} from "@/components/layout/DashboardShell";
import {
  AppstoreOutlined,
  BookOutlined,
  HistoryOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import MyLoans from "@/components/loans/MyLoans";
import { getCurrentUser } from "@/api/services/authService";
import styles from "@/Styles/StudentDashboard.module.css";
import profile from "@/assets/images/books/ProfileIcon.png";

export const myMenuContext = createContext();

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [me, setMe] = useState(null);
  const [loanSummary, setLoanSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCurrentUser();
        if (!cancelled) setMe(res.data);
      } catch {
        /* stats fall back to zero */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleShow() {
    setProfileOpen((prev) => !prev);
  }

  // The dashboard only shows the 8 newest titles, so searching here hands the
  // query to the catalogue page, which does it properly against the API.
  function handleSearch() {
    const q = inputValue.trim();
    navigate(q ? `/ViewAllBooks?search=${encodeURIComponent(q)}` : "/ViewAllBooks");
  }

  const activeLoans = loanSummary?.active ?? null;
  const overdueLoans = loanSummary?.overdue ?? 0;
  const outstandingFine = loanSummary?.outstandingFine ?? 0;
  const reservations =
    me?.reservations?.filter((r) => r.isActive).length ?? null;
  const seatBookings = me?.seatBookings?.length ?? null;
  const unread =
    me?.notifications?.filter((n) => !n.isRead).length ?? null;

  const firstName = me?.userName?.split(/[\s@._]/)[0];

  return (
    <DashboardShell
      eyebrow="Student"
      title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      subtitle="Your borrowings, the catalogue and everything happening in the library today."
      role={me?.role ?? "STUDENT"}
      userName={me?.userName}
      actions={
        <div className={styles.profileWrap}>
          <button
            onClick={handleShow}
            className={styles.profileButton}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <img src={profile} alt="" />
          </button>
          <myMenuContext.Provider value={{ handleShow }}>
            {profileOpen && (
              <div className={styles.profileMenu}>
                <ProfileList />
              </div>
            )}
          </myMenuContext.Provider>
        </div>
      }
    >
      <StatRow>
        <StatCard
          label="Books you have"
          value={activeLoans}
          hint={
            overdueLoans > 0
              ? `${overdueLoans} late · ₹${outstandingFine} to pay`
              : "borrowed right now"
          }
        />
        <StatCard label="Books you reserved" value={reservations} hint="waiting for you" />
        <StatCard label="Seats you booked" value={seatBookings} />
        <StatCard label="New messages" value={unread} hint="not read yet" />
      </StatRow>

      {/* Search + today, side by side */}
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearch}
          />
        </div>
        <PresentDay />
      </div>

      {/* Quick actions */}
      <div className={styles.quickGrid}>
        <button
          className={styles.quickCard}
          onClick={() => navigate("/occupancy")}
        >
          <span className={styles.quickIcon}>
            <AppstoreOutlined />
          </span>
          <span className={styles.quickTitle}>Seat availability</span>
          <span className={styles.quickDesc}>See free seats and reserve one</span>
        </button>
        <button
          className={styles.quickCard}
          onClick={() => navigate("/ViewAllBooks")}
        >
          <span className={styles.quickIcon}>
            <BookOutlined />
          </span>
          <span className={styles.quickTitle}>Browse catalogue</span>
          <span className={styles.quickDesc}>Search, filter and reserve books</span>
        </button>
        <button
          className={styles.quickCard}
          onClick={() => navigate("/history")}
        >
          <span className={styles.quickIcon}>
            <HistoryOutlined />
          </span>
          <span className={styles.quickTitle}>Borrowing history</span>
          <span className={styles.quickDesc}>What you have taken out before</span>
        </button>
        <button
          className={styles.quickCard}
          onClick={() => navigate("/feedback")}
        >
          <span className={styles.quickIcon}>
            <MessageOutlined />
          </span>
          <span className={styles.quickTitle}>Give feedback</span>
          <span className={styles.quickDesc}>Tell us how we are doing</span>
        </button>
      </div>

      <div className={styles.twoCol}>
        <Section title="Library timings" description="Plan your visit">
          <LibraryTimings />
        </Section>
        <Section title="Today's top headlines" description="From around the world">
          <News />
        </Section>
      </div>

      <Section
        title="Books you have"
        description="When each is due back, and what you owe if late"
      >
        <MyLoans onSummary={setLoanSummary} />
      </Section>

      <Section
        title="Latest collection"
        description="Newly added to the shelves"
      >
        <Books />
      </Section>

      <div className={styles.booksCol}>
        <Section title="All books" description="The wider collection">
          <div className={styles.scrollArea}>
            <Allbooks />
          </div>
        </Section>
        <Section title="E-books" description="Read online, anywhere">
          <Ebook />
        </Section>
      </div>

      <div className={styles.twoCol}>
        <Section title="Library rules" description="Please read before visiting">
          <Rules />
        </Section>
        <Section title="Need help?" description="We are here for you">
          <Help />
        </Section>
      </div>
    </DashboardShell>
  );
}
