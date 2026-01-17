import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Spin,
  Empty,
  message,
  Tag,
  Pagination,
  Button,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getAllUsers, deleteUser } from "@/api/services/userService";
import UserDetailsModal from "./UserDetailsModal";
import EditUserModal from "./EditUserModal";
import styles from "@/Styles/AdminDashboard.module.css";
import { toast } from "react-hot-toast";

const { Search } = Input;
const { Option } = Select;

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [usersFilters, setUsersFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    sortBy: "",
  });
  const [usersPagination, setUsersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [usersSearchInput, setUsersSearchInput] = useState("");
  const usersDebounceTimerRef = useRef(null);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (usersDebounceTimerRef.current)
      clearTimeout(usersDebounceTimerRef.current);
    usersDebounceTimerRef.current = setTimeout(() => {
      setUsersFilters((prev) => ({
        ...prev,
        search: usersSearchInput,
        page: 1,
      }));
    }, 500);
    return () => {
      if (usersDebounceTimerRef.current)
        clearTimeout(usersDebounceTimerRef.current);
    };
  }, [usersSearchInput]);

  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      setUsersLoading(true);
      setUsersError("");
      try {
        const params = { page: usersFilters.page, limit: usersFilters.limit };
        if (usersFilters.search) params.search = usersFilters.search;
        if (usersFilters.role) params.role = usersFilters.role;
        if (usersFilters.sortBy) params.sortBy = usersFilters.sortBy;

        const res = await getAllUsers(params);
        if (!cancelled) {
          if (res.data?.success) {
            const usersData = res.data.data || [];
            const paginationData = res.data.pagination || {};
            setUsers(usersData);
            setUsersPagination({
              current: paginationData.page || usersFilters.page,
              pageSize: paginationData.limit || usersFilters.limit,
              total: paginationData.total || 0,
            });
          } else {
            const msg = res.data?.message || "Failed to load users.";
            setUsersError(msg);
            message.error(msg);
            setUsers([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          const serverMsg =
            err?.response?.data?.message ||
            "Failed to load users. Please try again.";
          setUsersError(serverMsg);
          message.error(serverMsg);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [usersFilters]);

  const handleUsersFilterChange = (newFilters) => {
    if ("search" in newFilters) {
      setUsersSearchInput(newFilters.search || "");
      setUsersFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
      return;
    }
    setUsersFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleUsersImmediateSearch = (searchValue) => {
    if (usersDebounceTimerRef.current)
      clearTimeout(usersDebounceTimerRef.current);
    setUsersSearchInput(searchValue);
    setUsersFilters((prev) => ({ ...prev, search: searchValue, page: 1 }));
  };

  const handleUsersPageChange = (page, pageSize) => {
    setUsersFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleUsersClearAll = () => {
    setUsersSearchInput("");
    setUsersFilters({
      page: 1,
      limit: usersFilters.limit || 10,
      search: "",
      role: "",
      sortBy: "",
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "LIBRARIAN":
        return "blue";
      case "STUDENT":
        return "green";
      default:
        return "default";
    }
  };

  const handleDeleteClick = async (userId, userName) => {
    const ok = window.confirm(`Are you sure you want to delete "${userName}"?\nThis action cannot be undone.`);
  
    if (!ok) return;
  
    try {
      setUsersLoading(true);
      const res = await deleteUser(userId);
  
      if (res.data?.success) {
        toast.success(res.data.message || "User deleted successfully");
        setUsersFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        toast.error(res.data?.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setUsersLoading(false);
    }
  };
  
  const columns = [
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
      width: "10%",
      render: (t) => <span className={styles.tableCell}>{t || "N/A"}</span>,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: "20%",
      render: (t) => <span className={styles.tableCell}>{t || "N/A"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      render: (t) => <span className={styles.tableCell}>{t || "N/A"}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      render: (t) => <span className={styles.tableCell}>{t || "N/A"}</span>,
    },
    {
      title: "Roll Number",
      dataIndex: "rollNo",
      key: "rollNo",
      width: "12%",
      render: (t) => (
        <span className={styles.tableCell}>{t ? String(t) : "N/A"}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "10%",
      render: (r) => (
        <Tag color={getRoleColor(r)} className={styles.roleTag}>
          {r || "N/A"}
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
            onClick={(e) => {
              e.stopPropagation();
              setEditUserId(record.userID);
              setEditModalOpen(true);
            }}
          />
    
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(record.userID, record.userName);
            }}
          />
        </Space>
      ),
    }
    
    
  ];

  const handleTableChange = (paginationInfo, filters, sorter) => {
    let sortBy = "";
    if (sorter.field) {
      const order = sorter.order === "ascend" ? "_asc" : "_desc";
      if (sorter.field === "userName") sortBy = `username${order}`;
      else if (sorter.field === "email") sortBy = `email${order}`;
      else if (sorter.field === "role") sortBy = `role${order}`;
    }
    setUsersFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  return (
    <div className={styles.tableSection}>
      <h2 className={styles.tableSectionTitle}>Users Management</h2>

      <div className={styles.filtersContainer}>
        <Space size="middle" wrap className={styles.filters}>
          <Search
            placeholder="Search users by username, email, or phone..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            className={styles.searchInput}
            onSearch={handleUsersImmediateSearch}
            onChange={(e) => setUsersSearchInput(e.target.value)}
            value={usersSearchInput}
            style={{ width: 600 }}
          />

          <Select
            placeholder="Filter by Role"
            allowClear
            size="large"
            className={styles.filterSelect}
            value={usersFilters.role || undefined}
            onChange={(value) => handleUsersFilterChange({ role: value })}
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
            value={usersFilters.sortBy || undefined}
            onChange={(value) => handleUsersFilterChange({ sortBy: value })}
            style={{ width: 220 }}
          >
            <Option value="username_asc">Username (A-Z)</Option>
            <Option value="username_desc">Username (Z-A)</Option>
            <Option value="email_asc">Email (A-Z)</Option>
            <Option value="email_desc">Email (Z-A)</Option>
            <Option value="role_asc">Role (A-Z)</Option>
            <Option value="role_desc">Role (Z-A)</Option>
          </Select>

          {((usersFilters.role && usersFilters.role !== "") ||
            (usersFilters.sortBy && usersFilters.sortBy !== "") ||
            (usersSearchInput && usersSearchInput !== "")) && (
            <Button
              type="default"
              icon={<ClearOutlined />}
              size="large"
              onClick={handleUsersClearAll}
              className={styles.clearButton}
            >
              Clear All
            </Button>
          )}
        </Space>
      </div>

      {usersLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading users..." />
        </div>
      ) : usersError ? (
        <div className={styles.errorContainer}>
          <Empty description={usersError} />
        </div>
      ) : users.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty description="No users found" />
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <Table
              columns={columns}
              dataSource={users.map((u) => ({ ...u, key: u.userID }))}
              pagination={false}
              onChange={handleTableChange}
              className={styles.usersTable}
              scroll={{ x: "max-content" }}
              onRow={(record) => ({
                onClick: (e) => {
                  if (
                    e.target.tagName === "BUTTON" ||
                    e.target.closest("button")
                  ) {
                    return;
                  }
                  setSelectedUserId(record.userID);
                  setDetailModalOpen(true);
                },
                style: { cursor: "pointer" },
              })}
            />
          </div>

          {usersPagination.total > 0 && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={usersPagination.current}
                pageSize={usersPagination.pageSize}
                total={usersPagination.total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`
                }
                pageSizeOptions={["10", "20", "40", "60", "80", "100"]}
                onChange={handleUsersPageChange}
                onShowSizeChange={handleUsersPageChange}
              />
            </div>
          )}
        </>
      )}

      <UserDetailsModal
        userId={selectedUserId}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedUserId(null);
        }}
      />

      <EditUserModal
        userId={editUserId}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditUserId(null);
        }}
        onSuccess={() => setUsersFilters((p) => ({ ...p, page: 1 }))}
      />
    </div>
  );
}
