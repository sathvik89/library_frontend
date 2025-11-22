// src/components/ViewAllBooks.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Spin, Pagination, Empty, message } from "antd";
import styles from "../Styles/ViewAllBooks.module.css";
import { API_ENDPOINTS } from "../config/apiConfig";
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import BookFilters from "./BookFilters";
import PreviousButton from "./PreviousButton";

function ViewAllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    genre: "",
    availability: "",
    sortBy: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState("");
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
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.search) params.search = filters.search;
        if (filters.genre) params.genre = filters.genre;
        if (filters.availability) params.availability = filters.availability;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const res = await axios.get(API_ENDPOINTS.BOOKS.GET_ALL, { params });

        if (!cancelled) {
          if (res.data?.success) {
            const booksData = res.data.data || [];
            const paginationData = res.data.pagination || {};
            setBooks(booksData);
            setPagination({
              current: paginationData.page || filters.page,
              pageSize: paginationData.limit || filters.limit,
              total: paginationData.total || 0,
            });
          } else {
            const msg = res.data?.message || "Failed to load books.";
            setError(msg);
            message.error(msg);
            setBooks([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          const serverMsg = err?.response?.data?.message || "Failed to load books. Please try again.";
          setError(serverMsg);
          message.error(serverMsg);
          setBooks([]);
        }
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
    // If search is present in newFilters it means user typed - update searchInput to show in input
    if (Object.prototype.hasOwnProperty.call(newFilters, "search")) {
      setSearchInput(newFilters.search || "");
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImmediateSearch = (searchValue) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchInput(searchValue);
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Collection of All Books</h1>
        <PreviousButton text="Go Back" navi={-1} />
      </div>

      <BookFilters
        filters={filters}
        searchInput={searchInput}
        onFilterChange={handleFilterChange}
        onImmediateSearch={handleImmediateSearch}
      />

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading books..." />
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <Empty description={error} />
        </div>
      ) : books.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty description="No books found" />
        </div>
      ) : (
        <>
          <div className={styles.booksContainer}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} onCardClick={handleCardClick} />
            ))}
          </div>

          {pagination.total > 0 && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} books`}
                pageSizeOptions={["10", "20", "40", "60", "80", "100"]}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <BookModal book={selectedBook} open={modalOpen} onClose={handleModalClose} />
    </div>
  );
}

export default ViewAllBooks;
