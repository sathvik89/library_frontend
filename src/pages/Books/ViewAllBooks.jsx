import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Empty, Pagination, Skeleton, message } from "antd";
import styles from "@/Styles/ViewAllBooks.module.css";
import { getAllBooks } from "@/api/services/bookService";
import BookModal from "@/components/books/BookModal";
import BookCard from "@/components/books/BookCard";
import BookFilters from "@/components/books/BookFilters";
import PreviousButton from "@/components/common/PreviousButton";

const PAGE_SIZE = 20;

function ViewAllBooks() {
  // Arriving from the dashboard search: /ViewAllBooks?search=harry
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: PAGE_SIZE,
    search: initialSearch,
    genre: "",
    availability: "",
    sortBy: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debounceTimerRef = useRef(null);

  // debounce effect for search input
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  // main fetch (runs whenever filters change)
  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError("");
      try {
        const params = { page: filters.page, limit: filters.limit };
        if (filters.search) params.search = filters.search;
        if (filters.genre) params.genre = filters.genre;
        if (filters.availability) params.availability = filters.availability;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const res = await getAllBooks(params);
        if (cancelled) return;

        if (res.data?.success) {
          setBooks(res.data.data || []);
          const pg = res.data.pagination || {};
          setPagination({
            current: pg.page || filters.page,
            pageSize: pg.limit || filters.limit,
            total: pg.total || 0,
          });
        } else {
          const msg = res.data?.message || "Failed to load books.";
          setError(msg);
          message.error(msg);
          setBooks([]);
        }
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        const serverMsg =
          err?.response?.data?.message || "Failed to load books. Please try again.";
        setError(serverMsg);
        message.error(serverMsg);
        setBooks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    if (Object.prototype.hasOwnProperty.call(newFilters, "search")) {
      setSearchInput(newFilters.search || "");
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImmediateSearch = (value) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openBook = (book) => {
    setSelectedBookId(book.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBookId(null);
  };

  const from = (pagination.current - 1) * pagination.pageSize + 1;
  const to = Math.min(pagination.current * pagination.pageSize, pagination.total);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Catalogue</p>
          <h1 className={styles.heading}>Browse the collection</h1>
          <p className={styles.subheading}>
            Search the shelves, check what is available and reserve a copy.
          </p>
        </div>
        <PreviousButton text="Go Back" navi={-1} />
      </header>

      <div className={styles.filterCard}>
        <BookFilters
          filters={filters}
          searchInput={searchInput}
          onFilterChange={handleFilterChange}
          onImmediateSearch={handleImmediateSearch}
        />
      </div>

      {!loading && !error && pagination.total > 0 && (
        <p className={styles.resultLine}>
          Showing <strong>{from}–{to}</strong> of <strong>{pagination.total}</strong>{" "}
          {pagination.total === 1 ? "book" : "books"}
          {filters.search && <> for “{filters.search}”</>}
        </p>
      )}

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div className={styles.skeletonCard} key={i}>
              <div className={styles.skeletonCover} />
              <Skeleton active paragraph={{ rows: 2 }} title={{ width: "80%" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.stateBox}>
          <Empty description={error} />
        </div>
      ) : books.length === 0 ? (
        <div className={styles.stateBox}>
          <Empty
            description={
              filters.search
                ? `No books match “${filters.search}”.`
                : "No books match these filters."
            }
          />
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} onCardClick={openBook} />
            ))}
          </div>

          {pagination.total > pagination.pageSize && (
            <div className={styles.paginationRow}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                pageSizeOptions={["10", "20", "40", "60", "100"]}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <BookModal bookId={selectedBookId} open={modalOpen} onClose={closeModal} />
    </div>
  );
}

export default ViewAllBooks;
