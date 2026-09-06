import { useCallback, useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";
import { toast } from "react-hot-toast";
import { BookOutlined } from "@ant-design/icons";
import { getMyLoans, renewLoan } from "@/api/services/loanService";
import styles from "@/Styles/MyLoans.module.css";

// Days until it is due. Negative means it is late.
function daysUntil(date) {
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

// The books this person is holding. onSummary passes the counts up so the
// dashboard tiles show the same numbers without asking the server twice.
export default function MyLoans({ onSummary }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await getMyLoans();
      if (res.data?.success) {
        setLoans(res.data.data || []);
        onSummary?.(res.data.summary);
      }
    } catch {
      /* the empty state covers this */
    } finally {
      setLoading(false);
    }
  }, [onSummary]);

  useEffect(() => {
    load();
  }, [load]);

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

  const current = loans.filter((l) => l.status !== "RETURNED");

  if (loading) {
    return (
      <div className={styles.stateBox}>
        <Spin />
      </div>
    );
  }

  if (current.length === 0) {
    return (
      <div className={styles.stateBox}>
        <Empty
          description={
            <>
              You have not borrowed any books yet.
              <br />
              <span className={styles.hint}>
                Reserve one from the catalogue, then pick it up at the library desk.
              </span>
            </>
          }
        />
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {current.map((loan) => {
        const left = daysUntil(loan.dueDate);
        const overdue = left < 0;
        const soon = left >= 0 && left <= 3;

        return (
          <li
            key={loan.loanID}
            className={`${styles.item} ${overdue ? styles.itemOver : ""}`}
          >
            <div className={styles.cover}>
              {loan.bookCopy.catalog.coverImg ? (
                <img src={loan.bookCopy.catalog.coverImg} alt="" loading="lazy" />
              ) : (
                <BookOutlined className={styles.coverIcon} />
              )}
            </div>

            <div className={styles.body}>
              <strong className={styles.title}>{loan.bookCopy.catalog.title}</strong>
              <span className={styles.author}>{loan.bookCopy.catalog.authorName}</span>

              <span
                className={
                  overdue ? styles.dueOver : soon ? styles.dueSoon : styles.due
                }
              >
                {overdue
                  ? `${Math.abs(left)} day${Math.abs(left) === 1 ? "" : "s"} late`
                  : left === 0
                  ? "Due back today"
                  : `Due back in ${left} day${left === 1 ? "" : "s"}`}
                <span className={styles.dueDate}>
                  {" "}
                  &middot; {new Date(loan.dueDate).toLocaleDateString()}
                </span>
              </span>

              {loan.fine > 0 && (
                <span className={styles.fine}>Late fee so far: ₹{loan.fine}</span>
              )}
            </div>

            <Button
              size="small"
              onClick={() => handleRenew(loan)}
              loading={renewingId === loan.loanID}
              disabled={overdue}
              title={overdue ? "Late books cannot be kept longer" : "Keep it 7 more days"}
            >
              Keep longer
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
