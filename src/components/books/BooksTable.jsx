import React, { useEffect, useState } from "react";
import { Table, Space, Spin, Empty, message, Tag, Pagination, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllBooks, deleteBook } from "@/api/services/bookService";
import { toast } from "react-hot-toast";
import AddbookModal from "./AddbookModal";
import BookDetailsModal from "./BookDetailsModal";
import EditBookModal from "./EditBookModal";
import BookFilters from "./BookFilters";
import styles from "@/Styles/DataTable.module.css";

export default function BooksTable() {
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [booksFilters, setBooksFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    genre: "",
    availability: "",
    sortBy: "",
  });
  const [booksPagination, setBooksPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookDetailsModalOpen, setBookDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);

  // Fetch books (active whenever filters change)
  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setBooksLoading(true);
      setBooksError("");
      try {
        const params = {
          page: booksFilters.page,
          limit: booksFilters.limit,
        };

        if (booksFilters.search) params.search = booksFilters.search;
        if (booksFilters.genre) params.genre = booksFilters.genre;
        if (booksFilters.availability) params.availability = booksFilters.availability;
        if (booksFilters.sortBy) params.sortBy = booksFilters.sortBy;

        const res = await getAllBooks(params);

        if (!cancelled) {
          if (res.data?.success) {
            const booksData = res.data.data || [];
            const paginationData = res.data.pagination || {};
            setBooks(booksData);
            setBooksPagination({
              current: paginationData.page || booksFilters.page,
              pageSize: paginationData.limit || booksFilters.limit,
              total: paginationData.total || 0,
            });
          } else {
            const msg = res.data?.message || "Failed to load books.";
            setBooksError(msg);
            message.error(msg);
            setBooks([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          const serverMsg = err?.response?.data?.message || "Failed to load books. Please try again.";
          setBooksError(serverMsg);
          message.error(serverMsg);
          setBooks([]);
        }
      } finally {
        if (!cancelled) setBooksLoading(false);
      }
    }

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [booksFilters]);

  const handleBookAdded = () => {
    setBooksFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleBookDetailsModalClose = () => {
    setBookDetailsModalOpen(false);
    setSelectedBookId(null);
  };

  const handleEditClick = (e, bookId) => {
    e.stopPropagation();
    setEditingBookId(bookId);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingBookId(null);
  };

  const handleEditSuccess = () => {
    setBooksFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteClick = async (e, bookId) => {
    e.stopPropagation();
    try {
      setBooksLoading(true);
      const response = await deleteBook(bookId);
      if (response.data?.success) {
        toast.success(response.data.message || "Book deleted successfully!");
        setBooksFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        const errorMsg = response.data?.message || "Failed to delete book. Please try again.";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      const errorMsg = err?.response?.data?.message || "Failed to delete book. Please try again.";
      toast.error(errorMsg);
    } finally {
      setBooksLoading(false);
    }
  };

  const handleBooksPageChange = (page, pageSize) => {
    setBooksFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleBooksTableChange = (paginationInfo, filters, sorter) => {
    let sortBy = "";
    if (sorter.field) {
      const order = sorter.order === "ascend" ? "_asc" : "_desc";
      if (sorter.field === "title") {
        sortBy = `title${order}`;
      } else if (sorter.field === "authorName") {
        sortBy = `author${order}`;
      } else if (sorter.field === "totalCopies") {
        sortBy = `total${order}`;
      } else if (sorter.field === "availableCopies") {
        sortBy = `available${order}`;
      }
    }
    setBooksFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const booksColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text) => <span className={styles.tableCell}>{text || "N/A"}</span>,
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      width: "20%",
      render: (text) => <span className={styles.tableCell}>{text || "N/A"}</span>,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      width: "15%",
      render: (genre) => (
        <Tag color="blue" className={styles.genreTag}>
          {genre ? genre.replace(/_/g, " ") : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
      width: "15%",
      render: (text) => <span className={styles.tableCell}>{text || "N/A"}</span>,
    },
    {
      title: "Total Copies",
      dataIndex: "totalCopies",
      key: "totalCopies",
      width: "10%",
      align: "center",
      render: (count) => <span className={styles.tableCell}>{count || 0}</span>,
    },
    {
      title: "Available Copies",
      dataIndex: "availableCopies",
      key: "availableCopies",
      width: "15%",
      align: "center",
      render: (count) => (
        <Tag color={count > 0 ? "green" : "red"} className={styles.availabilityTag}>
          {count || 0}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={(e) => handleEditClick(e, record.id)}
            title="Edit book"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={(e) => handleDeleteClick(e, record.id)}
            title="Delete book"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className={styles.tableSection}>
        <h2 className={styles.tableSectionTitle}>Books Inventory</h2>
        
        <div className={styles.toolbar}>
          <BookFilters
            filters={booksFilters}
            onFilterChange={setBooksFilters}
          />
          <Button
            type="primary"
            size="large"
            onClick={() => setBookModalOpen(true)}
          >
            Add New Book
          </Button>
        </div>

        {booksLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Loading books..." />
          </div>
        ) : booksError ? (
          <div className={styles.errorContainer}>
            <Empty description={booksError} />
          </div>
        ) : books.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Empty description="No books found" />
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <Table
                columns={booksColumns}
                dataSource={books.map((book) => ({ ...book, key: book.id }))}
                pagination={false}
                onChange={handleBooksTableChange}
                className={styles.booksTable}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: (e) => {
                    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                      return;
                    }
                    setSelectedBookId(record.id);
                    setBookDetailsModalOpen(true);
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </div>

            {booksPagination.total > 0 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  current={booksPagination.current}
                  pageSize={booksPagination.pageSize}
                  total={booksPagination.total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} books`}
                  pageSizeOptions={["10", "20", "40", "60", "80", "100"]}
                  onChange={handleBooksPageChange}
                  onShowSizeChange={handleBooksPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      <AddbookModal
        open={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={handleBookAdded}
      />

      <BookDetailsModal
        bookId={selectedBookId}
        open={bookDetailsModalOpen}
        onClose={handleBookDetailsModalClose}
      />

      <EditBookModal
        bookId={editingBookId}
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}