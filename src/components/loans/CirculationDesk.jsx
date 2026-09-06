import { useCallback, useEffect, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Empty,
  Input,
  Pagination,
  Segmented,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import { toast } from "react-hot-toast";
import { getAllUsers } from "@/api/services/userService";
import { getAllLoans, issueLoan, returnLoan } from "@/api/services/loanService";
import { getReservations, cancelReservation } from "@/api/services/reservationService";
import styles from "@/Styles/CirculationDesk.module.css";

const PAGE_SIZE = 8;

// Days until the book is due. Negative means it is late.
function daysUntil(date) {
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function DueLabel({ loan }) {
  if (loan.status === "RETURNED") {
    return <span className={styles.dueQuiet}>brought back</span>;
  }
  const d = daysUntil(loan.dueDate);
  if (d < 0) {
    return (
      <span className={styles.dueOver}>
        {Math.abs(d)} day{Math.abs(d) === 1 ? "" : "s"} late
      </span>
    );
  }
  if (d === 0) return <span className={styles.dueSoon}>due back today</span>;
  if (d <= 3) return <span className={styles.dueSoon}>due back in {d} days</span>;
  return <span className={styles.dueQuiet}>due back in {d} days</span>;
}

export default function CirculationDesk() {
  const [loans, setLoans] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ON_LOAN");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [holds, setHolds] = useState([]);
  const [holdsLoading, setHoldsLoading] = useState(true);

  // issue form
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [issuing, setIssuing] = useState(false);
  const barcodeRef = useRef(null);
  const searchTimer = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (search.trim()) params.search = search.trim();
      // "On loan" spans both ACTIVE and OVERDUE, so it is filtered client-side.
      if (statusFilter === "RETURNED") params.status = "RETURNED";

      const res = await getAllLoans(params);
      if (res.data?.success) {
        const rows =
          statusFilter === "ON_LOAN"
            ? res.data.data.filter((l) => l.status !== "RETURNED")
            : res.data.data;
        setLoans(rows);
        setTotal(res.data.pagination?.total ?? 0);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not load loans.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  const loadHolds = useCallback(async () => {
    setHoldsLoading(true);
    try {
      const res = await getReservations({ limit: 20 });
      if (res.data?.success) setHolds(res.data.data || []);
    } catch {
      /* the empty state covers this */
    } finally {
      setHoldsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadHolds();
  }, [loadHolds]);

  // Clicking a waiting student fills the form in, so you only have to confirm.
  const prepareFromHold = (hold) => {
    setSelectedMember(hold.user);
    setMemberQuery(hold.user.userName);
    setBarcode(hold.suggestedBarcode || "");
    barcodeRef.current?.focus();
    toast.success(`Ready to give "${hold.catalog.title}" to ${hold.user.userName}.`);
  };

  const handleCancelHold = async (hold) => {
    try {
      const res = await cancelReservation(hold.reservationID);
      toast.success(res.data.message);
      loadHolds();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not cancel the reservation.");
    }
  };

  // member lookup for the issue form
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!memberQuery.trim()) {
      setMemberOptions([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await getAllUsers({ search: memberQuery.trim(), limit: 6 });
        setMemberOptions(
          (res.data?.data || []).map((u) => ({
            value: String(u.userID),
            label: (
              <div className={styles.memberOption}>
                <strong>{u.userName}</strong>
                <span>{u.email}</span>
              </div>
            ),
            user: u,
          }))
        );
      } catch {
        setMemberOptions([]);
      }
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [memberQuery]);

  const handleIssue = async () => {
    if (!selectedMember) return toast.error("Choose who is borrowing first.");
    if (!barcode.trim()) return toast.error("Scan or type the barcode on the book.");

    setIssuing(true);
    try {
      const res = await issueLoan({
        userID: selectedMember.userID,
        barcode: barcode.trim(),
      });
      toast.success(res.data.message);
      if (res.data.fulfilledReservation) {
        toast.success("This also cleared their reservation.");
      }
      setBarcode("");
      barcodeRef.current?.focus();
      setPage(1);
      load();
      loadHolds();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not give out the book.");
    } finally {
      setIssuing(false);
    }
  };

  const handleReturn = async (loan) => {
    try {
      const res = await returnLoan(loan.loanID);
      toast.success(res.data.message, { duration: 5000 });
      load();
      loadHolds();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not take the book back.");
    }
  };

  return (
    <section className={styles.desk}>
      <header className={styles.deskHeader}>
        <div>
          <h2 className={styles.deskTitle}>Give out &amp; take back books</h2>
          <p className={styles.deskSub}>
            Hand a book to a student and set its return date, or check one back in.
          </p>
        </div>
      </header>

      {/* ---------- waiting holds ---------- */}
      <div className={styles.holds}>
        <div className={styles.holdsHead}>
          <h3 className={styles.holdsTitle}>
            Reservation requests
            {holds.length > 0 && <span className={styles.holdsCount}>{holds.length}</span>}
          </h3>
          <span className={styles.holdsHint}>
            Accept to hand the book over, or reject if you cannot supply it. Either way the student is told.
          </span>
        </div>

        {holdsLoading ? (
          <div className={styles.holdsEmpty}><Spin size="small" /></div>
        ) : holds.length === 0 ? (
          <div className={styles.holdsEmpty}>No reservation requests right now.</div>
        ) : (
          <ul className={styles.holdList}>
            {holds.map((h) => (
              <li key={h.reservationID} className={styles.holdItem}>
                <span className={styles.holdQ}>#{h.queuePosition}</span>
                <div className={styles.holdBody}>
                  <strong>{h.catalog.title}</strong>
                  <span className={styles.meta}>
                    {h.user.userName}
                    {h.suggestedBarcode ? ` · pull ${h.suggestedBarcode}` : ""}
                  </span>
                </div>
                {h.readyForPickup ? (
                  <Tag color="green">on the shelf</Tag>
                ) : (
                  <Tag color="orange">all borrowed</Tag>
                )}
                <div className={styles.holdActions}>
                  <Button
                    size="small"
                    type="primary"
                    disabled={!h.readyForPickup}
                    onClick={() => prepareFromHold(h)}
                  >
                    Accept
                  </Button>
                  <Button size="small" danger onClick={() => handleCancelHold(h)}>
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- issue ---------- */}
      <div className={styles.issueRow}>
        <label className={styles.field}>
          <span className={styles.label}>Who is borrowing</span>
          <AutoComplete
            value={memberQuery}
            options={memberOptions}
            onSearch={(v) => {
              setMemberQuery(v);
              setSelectedMember(null);
            }}
            onSelect={(value, option) => {
              setSelectedMember(option.user);
              setMemberQuery(option.user.userName);
              barcodeRef.current?.focus();
            }}
            placeholder="Type a student's name or email"
            size="large"
            style={{ width: "100%" }}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Barcode on the book</span>
          <Input
            ref={barcodeRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={handleIssue}
            placeholder="Scan it, or type it: BOOK-13-1"
            size="large"
          />
        </label>

        <Button
          type="primary"
          size="large"
          loading={issuing}
          onClick={handleIssue}
          className={styles.issueBtn}
        >
          Give book
        </Button>
      </div>

      {selectedMember && (
        <p className={styles.pickedMember}>
          Giving to <strong>{selectedMember.userName}</strong> ({selectedMember.email}).
          They must return it within 14 days.
        </p>
      )}

      {/* ---------- loans ---------- */}
      <div className={styles.listHeader}>
        <Segmented
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={[
            { label: "Out now", value: "ON_LOAN" },
            { label: "Brought back", value: "RETURNED" },
          ]}
        />
        <Input.Search
          allowClear
          placeholder="Search by student, book or barcode"
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setSearch("");
              setPage(1);
            }
          }}
          className={styles.listSearch}
        />
      </div>

      {loading ? (
        <div className={styles.stateBox}>
          <Spin />
        </div>
      ) : loans.length === 0 ? (
        <div className={styles.stateBox}>
          <Empty
            description={
              statusFilter === "ON_LOAN"
                ? "No books are out right now."
                : "No books have been brought back yet."
            }
          />
        </div>
      ) : (
        <ul className={styles.loanList}>
          {loans.map((loan) => (
            <li key={loan.loanID} className={styles.loanRow}>
              <div className={styles.loanBook}>
                <strong>{loan.bookCopy.catalog.title}</strong>
                <span className={styles.meta}>
                  {loan.bookCopy.barcode} &middot; {loan.bookCopy.catalog.authorName}
                </span>
              </div>

              <div className={styles.loanMember}>
                <strong>{loan.user.userName}</strong>
                <span className={styles.meta}>{loan.user.email}</span>
              </div>

              <div className={styles.loanDue}>
                <DueLabel loan={loan} />
                <span className={styles.meta}>
                  {new Date(loan.dueDate).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.loanState}>
                {loan.status === "OVERDUE" && <Tag color="red">LATE</Tag>}
                {loan.status === "ACTIVE" && <Tag color="blue">OUT</Tag>}
                {loan.status === "RETURNED" && <Tag>BROUGHT BACK</Tag>}
                {loan.fine > 0 && (
                  <Tooltip title="Late fee owed on this book">
                    <span className={styles.fine}>₹{loan.fine}</span>
                  </Tooltip>
                )}
              </div>

              <div className={styles.loanAction}>
                {loan.status !== "RETURNED" && (
                  <Button size="small" onClick={() => handleReturn(loan)}>
                    Take back
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {total > PAGE_SIZE && (
        <div className={styles.pager}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </section>
  );
}
