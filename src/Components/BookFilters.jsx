import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "../Styles/BookFilters.module.css";

const { Search } = Input;
const { Option } = Select;

const GENRES = [
  "FICTION",
  "NON_FICTION",
  "MYSTERY",
  "THRILLER",
  "FANTASY",
  "SCIENCE_FICTION",
  "ROMANCE",
  "HISTORICAL",
  "HORROR",
  "BIOGRAPHY",
  "SELF_HELP",
  "POETRY",
  "DRAMA",
  "ADVENTURE",
  "CRIME",
  "YOUNG_ADULT",
  "CHILDREN",
  "CLASSICS",
];

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "author_asc", label: "Author (A-Z)" },
  { value: "author_desc", label: "Author (Z-A)" },
  { value: "available_desc", label: "Most Available" },
  { value: "available_asc", label: "Least Available" },
];

function BookFilters({ filters, onFilterChange }) {
  const handleSearch = (value) => {
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const handleGenreChange = (value) => {
    onFilterChange({ ...filters, genre: value, page: 1 });
  };

  const handleAvailabilityChange = (value) => {
    onFilterChange({ ...filters, availability: value, page: 1 });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sortBy: value, page: 1 });
  };

  return (
    <div className={styles.filtersContainer}>
      <Space size="middle" wrap className={styles.filters}>
        <Search
          placeholder="Search books by title or author..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className={styles.searchInput}
          onSearch={handleSearch}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              handleSearch("");
            }
            else{
              handleSearch(value);
            }
          }}
          value={filters.search}
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
          dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
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
          style={{ width: 200 }}
        >
          {SORT_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Space>
    </div>
  );
}

export default BookFilters;

