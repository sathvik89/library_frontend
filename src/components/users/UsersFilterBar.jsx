import React from "react";
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import styles from "@/Styles/DataTable.module.css";

const { Search } = Input;
const { Option } = Select;

export default function UsersFilterBar({
  filters,
  searchInput,
  onFilterChange,
  onImmediateSearch,
}) {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleClearAll = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit || 10,
      search: "",
      role: "",
      sortBy: "",
    }, true); // true indicates clear all
  };

  const hasActiveFilters =
    (filters.role && filters.role !== "") ||
    (filters.sortBy && filters.sortBy !== "") ||
    (searchInput && searchInput !== "") ||
    (filters.search && filters.search !== "");

  return (
    <div className={styles.filtersContainer}>
      <Space size="middle" wrap className={styles.filters}>
        <Search
          placeholder="Search users by username, email, or phone..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className={styles.searchInput}
          onSearch={onImmediateSearch}
          onChange={handleSearchChange}
          value={searchInput}
          style={{ width: 600 }}
        />

        <Select
          placeholder="Filter by Role"
          allowClear
          size="large"
          className={styles.filterSelect}
          value={filters.role || undefined}
          onChange={(value) => onFilterChange({ role: value, page: 1 })}
          style={{ width: 200 }}
        >
          <Option value="ADMIN">Admin</Option>
          <Option value="LIBRARIAN">Librarian</Option>
          <Option value="STUDENT">Student</Option>
        </Select>

        <Select
          placeholder="Sort By"
          allowClear
          size="large"
          className={styles.filterSelect}
          value={filters.sortBy || undefined}
          onChange={(value) => onFilterChange({ sortBy: value, page: 1 })}
          style={{ width: 220 }}
        >
          <Option value="username_asc">Username (A-Z)</Option>
          <Option value="username_desc">Username (Z-A)</Option>
          <Option value="email_asc">Email (A-Z)</Option>
          <Option value="email_desc">Email (Z-A)</Option>
          <Option value="role_asc">Role (A-Z)</Option>
          <Option value="role_desc">Role (Z-A)</Option>
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
