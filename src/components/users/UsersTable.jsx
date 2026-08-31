import  { useEffect, useState, useRef } from "react";
import { Table, Spin, Empty, message, Tag, Pagination, Button, Space, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getAllUsers, deleteUser } from "@/api/services/userService";
import UsersFilterBar from "@/components/users/UsersFilterBar";
import styles from "@/Styles/DataTable.module.css";
import { toast } from "react-hot-toast";

const { confirm } = Modal;

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    sortBy: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.search) params.search = filters.search;
        if (filters.role) params.role = filters.role;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const res = await getAllUsers(params);

        if (!cancelled) {
          if (res.data?.success) {
            setUsers(res.data.data || []);
            const paginationData = res.data.pagination || {};
            setPagination({
              current: paginationData.page || 1,
              pageSize: paginationData.limit || 10,
              total: paginationData.total || 0,
            });
          } else {
            const msg = res.data?.message || "Failed to load users.";
            setError(msg);
            message.error(msg);
            setUsers([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          const serverMsg = err?.response?.data?.message || "Failed to load users. Please try again.";
          setError(serverMsg);
          message.error(serverMsg);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleDelete = async (userId) => {
    confirm({
      title: "Are you sure delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      // Static modals sit outside ConfigProvider, so state the button style here.
      okButtonProps: { danger: true, type: "primary" },
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await deleteUser(userId);
          if (res.data?.success) {
            toast.success("User deleted successfully");
            setFilters((prev) => ({ ...prev })); 
          } else {
            toast.error(res.data?.message || "Failed to delete user");
          }
        } catch (error) {
          console.error("Delete user error:", error);
          toast.error(error?.response?.data?.message || "Failed to delete user");
        }
      },
    });
  };

  const handleFilterChange = (newFilters, clearAll = false) => {
    if (clearAll) {
        setSearchInput("");
        setFilters(newFilters);
    } else if ("search" in newFilters) {
        setSearchInput(newFilters.search || "");
        // We generally don't set filters directly for search input as it's debounced,
        // but here we might want to update it if it's passed from the bar
         if (newFilters.search === "") {
             setFilters((prev) => ({ ...prev, search: "", page: 1 }));
         }
    } else {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  };

  const handleImmediateSearch = (value) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setSearchInput(value);
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };


  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    let sortBy = "";
    if (sorter.field) {
      const order = sorter.order === "ascend" ? "_asc" : "_desc";
      const fieldMap = {
          username: "username",
          email: "email",
          role: "role"
      };
      
      if(fieldMap[sorter.field]) {
          sortBy = `${fieldMap[sorter.field]}${order}`;
      }
    }
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "username",
      sorter: true,
      width: "20%",
      render: (text) => <span className={styles.tableCell}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: "20%",
      render: (text) => <span className={styles.tableCell}>{text}</span>,
    },
    {
        title: "Phone Number",
        dataIndex: "phone",
        key: "phoneNumber",
        width: "15%",
        render: (text) => <span className={styles.tableCell}>{text || "N/A"}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: true,
      width: "15%",
      render: (role) => {
        let color = "geekblue";
        if (role === "ADMIN") color = "volcano";
        if (role === "LIBRARIAN") color = "green";
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      },
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
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.userID);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tableSection}>
      <h2 className={styles.tableSectionTitle}>Users List</h2>

      <UsersFilterBar 
        filters={filters}
        searchInput={searchInput}
        onFilterChange={handleFilterChange}
        onImmediateSearch={handleImmediateSearch}
      />

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading users..." />
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <Empty description={error} />
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
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`
                }
                pageSizeOptions={["10", "20", "40", "60", "80", "100"]}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}


    </div>
  );
}
