import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Input, Select, Space, Spin, Empty, message, Tag, Pagination, Button } from "antd";
import { SearchOutlined, ClearOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Logoutbutton from "@/components/common/Logoutbutton";
import PreviousButton from "@/components/common/PreviousButton";
import AddbookModal from "@/components/books/AddbookModal";
import BookDetailsModal from "@/components/books/BookDetailsModal";
import EditBookModal from "@/components/books/EditBookModal";
import { getAllBooks, deleteBook } from "@/api/services/bookService";
import styles from "@/Styles/LibrarianDashboard.module.css";
import { GENRES } from "@/Constants/constants";
import { toast } from "react-hot-toast";

const { Search } = Input;
const { Option } = Select;
    
export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({page: 1,limit: 10,search: "",genre: "",availability: "",sortBy: "",});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const debounceTimerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookDetailsModalOpen, setBookDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null); 
  // Debounce effect for search input
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  // fetch books (active whenever filters change)
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

        const res = await getAllBooks(params);

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


  const handleBookAdded = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
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
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteClick =async (e, bookId) => {
    e.stopPropagation();
    try{
      setLoading(true);
      const response = await deleteBook(bookId);
      if(response.data?.success){
        toast.success(response.data.message || "Book deleted successfully!");
        setFilters((prev) => ({ ...prev, page: 1 }));
      }
      else{
          const errorMsg = response.data?.message || "Failed to delete book. Please try again.";
          toast.error(errorMsg);
      }
    }
    catch(err){
      console.error("Error deleting book:", err);
      const errorMsg = err?.response?.data?.message || "Failed to delete book. Please try again.";
      toast.error(errorMsg);
    }
    finally{
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    if ("search" in newFilters) {
      setSearchInput(newFilters.search || "");
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleImmediateSearch = (searchValue) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchInput(searchValue);
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleClearAll = () => {
    setSearchInput("");
    setFilters({
      page: 1,
      limit: filters.limit || 10,
      search: "",
      genre: "",
      availability: "",
      sortBy: "",
    });
  };

  const hasActiveFilters =
    (filters.genre && filters.genre !== "") ||
    (filters.availability && filters.availability !== "") ||
    (filters.sortBy && filters.sortBy !== "") ||
    (searchInput && searchInput !== "") ||
    (filters.search && filters.search !== "");

  const columns = [
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

  const handleTableChange = (paginationInfo, filters, sorter) => {
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
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Librarian Dashboard</h1>
      <p className={styles.subheading}>
        Welcome! Manage books, reservations, and daily library operations.
      </p>

      <div className={styles.cardsContainer}>
        <Card title="Book Management" className={styles.dashboardCard}>
          <p>Add, update, and manage library books and inventory.</p>
        </Card>

        <Card title="Reservations" className={styles.dashboardCard}>
          <p>View and manage book reservations and checkouts.</p>
        </Card>

        <Card title="Daily Operations" className={styles.dashboardCard}>
          <p>Handle daily tasks like returns, renewals, and member assistance.</p>
        </Card>
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.tableSectionTitle}>Books Inventory</h2>
        
        <div className={styles.filtersContainer}>
          <Space size="middle" wrap className={styles.filters}>
            <Search
              placeholder="Search books by title or author..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              className={styles.searchInput}
              onSearch={handleImmediateSearch}
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              style={{ width: 600 }}
            />

            <Select
              placeholder="Filter by Genre"
              allowClear
              size="large"
              className={styles.filterSelect}
              value={filters.genre || undefined}
              onChange={(value) => handleFilterChange({ genre: value })}
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {GENRES.map((genre) => (
                <Option key={genre} value={genre} label={genre}>
                  {genre.replace(/_/g, " ")}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Availability"
              allowClear
              size="large"
              className={styles.filterSelect}
              value={filters.availability || undefined}
              onChange={(value) => handleFilterChange({ availability: value })}
              style={{ width: 200 }}
            >
              <Option value="available">Available Only</Option>
              <Option value="unavailable">Unavailable Only</Option>
            </Select>

            <Select
              placeholder="Sort By"
              allowClear
              size="large"
              className={styles.filterSelect}
              value={filters.sortBy || undefined}
              onChange={(value) => handleFilterChange({ sortBy: value })}
              style={{ width: 200 }}
            >
              <Option value="title_asc">Title (A-Z)</Option>
              <Option value="title_desc">Title (Z-A)</Option>
              <Option value="available_desc">Most Available</Option>
              <Option value="available_asc">Least Available</Option>
            </Select>

            {hasActiveFilters && (
              <Button
              type="default"
              icon={<ClearOutlined />}
              size="large"
              onClick={handleClearAll}
              className={styles.clearButton}
              >
                Clear All
              </Button>
            )}
            <Button type="primary" onClick={()=>setModalOpen(true)}>Add New Book</Button>
          </Space>
        </div>

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
            <div className={styles.tableContainer}>
              <Table
                columns={columns}
                dataSource={books.map((book) => ({ ...book, key: book.id }))}
                pagination={false}
                onChange={handleTableChange}
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
      </div>

      <div className={styles.actionsContainer}>
        <PreviousButton navi="/login" />
        <Logoutbutton />
      </div>

      <AddbookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
    </div>
  );
}

