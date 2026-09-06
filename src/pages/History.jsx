import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Spin, Table, Tag } from "antd";
import { toast } from "react-hot-toast";
import { BookOutlined } from "@ant-design/icons";
import logo from "@/assets/images/books/RUimage.png";
import styles from "@/Styles/History.module.css";
import PreviousButton from "@/components/common/PreviousButton";
import { getMyLoans, renewLoan } from "@/api/services/loanService";

// Days until it is due. Negative means it is late.
function daysUntil(date) {
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

const fmt = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function History() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState(null);

  const load = async () => {
    try {
      const res = await getMyLoans();
      if (res.data?.success) {
        setLoans(res.data.data || []);
        setSummary(res.data.summary);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not load your books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRenew = async (loan) => {
    setRenewingId(loan.loanID);
    try {
      const res = await renewLoan(loan.loanID);
      toast.success(res.data.message);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not extend the due date.");
    } finally {
      setRenewingId(null);
    }
  };

  const columns = [
    {
      title: "Book",
      dataIndex: ["bookCopy", "catalog", "title"],
      key: "title",
      render: (_, loan) => (
        <div className={styles.bookCell}>
          <div className={styles.cover}>
            {loan.bookCopy.catalog.coverImg ? (
              <img src={loan.bookCopy.catalog.coverImg} alt="" loading="lazy" />
            ) : (
              <BookOutlined className={styles.coverIcon} />
            )}
          </div>
          <div className={styles.bookText}>
            <strong>{loan.bookCopy.catalog.title}</strong>
            <span>{loan.bookCopy.catalog.authorName}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Barcode",
      dataIndex: ["bookCopy", "barcode"],
      key: "barcode",
      responsive: ["lg"],
      render: (b) => <span className={styles.barcode}>{b || "—"}</span>,
    },
    {
      title: "Taken on",
      dataIndex: "issueDate",
      key: "issueDate",
      responsive: ["md"],
      render: (d) => <span className={styles.date}>{fmt(d)}</span>,
    },
    {
      title: "Due back",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (d, loan) => {
        if (loan.status === "RETURNED") {
          return <span className={styles.date}>{fmt(d)}</span>;
        }
        const left = daysUntil(d);
        return (
          <div className={styles.dueCell}>
            <span className={styles.date}>{fmt(d)}</span>
            <span
              className={
                left < 0 ? styles.dueOver : left <= 3 ? styles.dueSoon : styles.dueOk
              }
            >
              {left < 0
                ? `${Math.abs(left)} day${Math.abs(left) === 1 ? "" : "s"} late`
                : left === 0
                ? "due back today"
                : `in ${left} day${left === 1 ? "" : "s"}`}
            </span>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "OVERDUE") return <Tag color="red">LATE</Tag>;
        if (status === "ACTIVE") return <Tag color="blue">WITH YOU</Tag>;
        return <Tag>RETURNED</Tag>;
      },
    },
    {
      title: "Late fee",
      dataIndex: "fine",
      key: "fine",
      align: "right",
      render: (fine) =>
        fine > 0 ? (
          <span className={styles.fine}>₹{fine}</span>
        ) : (
          <span className={styles.noFine}>—</span>
        ),
    },
    {
      title: "",
      key: "action",
      align: "right",
      render: (_, loan) =>
        loan.status === "ACTIVE" ? (
          <Button
            size="small"
            loading={renewingId === loan.loanID}
            onClick={() => handleRenew(loan)}
          >
            Keep longer
          </Button>
        ) : null,
    },
  ];

  const current = loans.filter((l) => l.status !== "RETURNED");
  const past = loans.filter((l) => l.status === "RETURNED");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your account</p>
          <h1 className={styles.heading}>Your books</h1>
          <p className={styles.sub}>
            What you have right now, and everything you have returned before.
          </p>
        </div>
        <img src={logo} alt="" className={styles.logo} />
      </header>

      {summary && (
        <div className={styles.summary}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>You have</span>
            <span className={styles.statValue}>{summary.active}</span>
            <span className={styles.statHint}>up to {summary.limit} at a time</span>
          </div>
          <div className={`${styles.stat} ${summary.overdue > 0 ? styles.statBad : ""}`}>
            <span className={styles.statLabel}>Late</span>
            <span className={styles.statValue}>{summary.overdue}</span>
            <span className={styles.statHint}>bring these back first</span>
          </div>
          <div className={`${styles.stat} ${summary.outstandingFine > 0 ? styles.statBad : ""}`}>
            <span className={styles.statLabel}>You owe</span>
            <span className={styles.statValue}>₹{summary.outstandingFine}</span>
            <span className={styles.statHint}>₹2 for each late day</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Returned</span>
            <span className={styles.statValue}>{past.length}</span>
            <span className={styles.statHint}>since you joined</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.stateBox}>
          <Spin size="large" />
        </div>
      ) : loans.length === 0 ? (
        <div className={styles.stateBox}>
          <Empty
            description={
              <>
                You have not borrowed a book yet.
                <br />
                <span className={styles.hint}>
                  Reserve one from the catalogue, then pick it up at the library desk.
                </span>
              </>
            }
          >
            <Button type="primary" onClick={() => navigate("/ViewAllBooks")}>
              Browse the catalogue
            </Button>
          </Empty>
        </div>
      ) : (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Books you have now
              <span className={styles.count}>{current.length}</span>
            </h2>
            {current.length === 0 ? (
              <p className={styles.emptyLine}>You do not have any books right now.</p>
            ) : (
              <div className={styles.tableWrap}>
                <Table
                  columns={columns}
                  dataSource={current.map((l) => ({ ...l, key: l.loanID }))}
                  pagination={false}
                  size="middle"
                />
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Books you returned
              <span className={styles.count}>{past.length}</span>
            </h2>
            {past.length === 0 ? (
              <p className={styles.emptyLine}>You have not returned anything yet.</p>
            ) : (
              <div className={styles.tableWrap}>
                <Table
                  columns={columns.filter((c) => c.key !== "action")}
                  dataSource={past.map((l) => ({ ...l, key: l.loanID }))}
                  pagination={past.length > 10 ? { pageSize: 10 } : false}
                  size="middle"
                />
              </div>
            )}
          </section>
        </>
      )}

      <div className={styles.footerRow}>
        <PreviousButton navi="/studentDashboard" text="Back to dashboard" />
      </div>
    </main>
  );
}
