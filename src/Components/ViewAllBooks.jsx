import { useEffect, useState } from "react";
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
    limit: 12,
    search: "",
    genre: "",
    availability: "",
    sortBy: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.search) {
          params.search = filters.search;
        }
        if (filters.genre) {
          params.genre = filters.genre;
        }
        if (filters.availability) {
          params.availability = filters.availability;
        }
        if (filters.sortBy) {
          params.sortBy = filters.sortBy;
        }

        const res = await axios.get(API_ENDPOINTS.BOOKS.GET_ALL, { params });

        // Handle both paginated and non-paginated responses
        if (res.data.success) {
          if (res.data.data && Array.isArray(res.data.data)) {
            setBooks(res.data.data);
            setPagination({
              current: filters.page,
              pageSize: filters.limit,
              total: res.data.total || res.data.data.length,
            });
          } else if (res.data.data && res.data.data.books) {
            // If data has a books property, it's paginated
            setBooks(res.data.data.books);
            setPagination({
              current: res.data.data.currentPage || filters.page,
              pageSize: res.data.data.pageSize || filters.limit,
              total: res.data.data.total || 0,
            });
          } else {
            setBooks([]);
            setPagination({
              current: filters.page,
              pageSize: filters.limit,
              total: 0,
            });
          }
        } else {
          setError("Failed to load books.");
          message.error("Failed to load books.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load books.");
        message.error("Failed to load books. Please try again.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBooks();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters({ ...filters, page, limit: pageSize });
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

      <BookFilters filters={filters} onFilterChange={handleFilterChange} />

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
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} books`
                }
                pageSizeOptions={["12", "24", "48", "96"]}
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
