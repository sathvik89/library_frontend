import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Input, Select, Space, Spin, Empty, message, Tag, Pagination, Button } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import axios from "axios";
import Logoutbutton from "./Logoutbutton";
import PreviousButton from "./PreviousButton";
import { API_ENDPOINTS } from "../config/apiConfig";
import styles from "../Styles/LibrarianDashboard.module.css";

const { Search } = Input;
const { Option } = Select;

const GENRES = [
  "FICTION", "NON_FICTION", "MYSTERY", "THRILLER", "FANTASY", "SCIENCE_FICTION", "ROMANCE",
  "HISTORICAL", "HORROR", "BIOGRAPHY", "SELF_HELP", "POETRY", "DRAMA", "ADVENTURE", "CRIME",
  "YOUNG_ADULT", "CHILDREN", "CLASSICS",
];

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  // Main fetch (runs whenever filters change)
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
    if (Object.prototype.hasOwnProperty.call(newFilters, "search")) {
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
    </div>
  );
}

