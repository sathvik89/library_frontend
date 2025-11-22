// src/components/BookFilters.jsx
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import styles from "../Styles/BookFilters.module.css";

const { Search } = Input;
const { Option } = Select;

const GENRES = [
  "FICTION","NON_FICTION","MYSTERY","THRILLER","FANTASY","SCIENCE_FICTION","ROMANCE",
  "HISTORICAL","HORROR","BIOGRAPHY","SELF_HELP","POETRY","DRAMA","ADVENTURE","CRIME",
  "YOUNG_ADULT","CHILDREN","CLASSICS",
];

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "available_desc", label: "Most Available" },
  { value: "available_asc", label: "Least Available" },
];

function BookFilters({ filters, searchInput, onFilterChange, onImmediateSearch }) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const handleSearchSubmit = (value) => {
    if (onImmediateSearch) {
      onImmediateSearch(value);
    } else {
      onFilterChange({ ...filters, search: value, page: 1 });
    }
  };

  const handleGenreChange = (value) => onFilterChange({ ...filters, genre: value, page: 1 });
  const handleAvailabilityChange = (value) => onFilterChange({ ...filters, availability: value, page: 1 });
  const handleSortChange = (value) => onFilterChange({ ...filters, sortBy: value, page: 1 });

  const handleClearAll = () => {
    // clear search & other filters, keep page reset to 1 and keep limit
    onFilterChange({
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

  return (
    <div className={styles.filtersContainer}>
      <Space size="middle" wrap className={styles.filters}>
        <Search
          placeholder="Search books by title or author..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className={styles.searchInput}
          onSearch={handleSearchSubmit}
          onChange={handleSearchChange}
          value={searchInput !== undefined ? searchInput : filters.search}
          style={{ width: 672 }}
        />

        <Select
          placeholder="Filter by Genre"
          allowClear
          size="large"
          className={styles.filterSelect}
          value={filters.genre || undefined}
          onChange={handleGenreChange}
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
          onChange={handleAvailabilityChange}
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
          onChange={handleSortChange}
          style={{ width: 160 }}
        >
          {SORT_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
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
  );
}

export default BookFilters;
