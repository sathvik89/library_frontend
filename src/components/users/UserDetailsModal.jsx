import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Tag, Divider, Table, Spin, message, Typography } from "antd";
import { getUserById } from "@/api/services/userService";
import { toast } from "react-hot-toast";

const { Title, Paragraph } = Typography;

const ROLE_COLOR = {
  ADMIN: "red",
  LIBRARIAN: "blue",
  STUDENT: "green",
};

export default function UserDetailsModal({ userId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (open && userId) fetchUser();
    else setUser(null);
  }, [open, userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUserById(userId);
      if (res.data?.success) {
        setUser(res.data.data);
      } else {
        const m = res.data?.message || "Failed to load user";
        message.error(m);
        toast.error(m);
        onClose();
      }
    } catch (err) {
      console.error("Error in fetchUser:", err);
      const m = err?.response?.data?.message || "Failed to load user. Try again.";
      message.error(m);
      toast.error(m);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const loansColumns = [
    { title: "Loan ID", dataIndex: "loanID", key: "loanID" },
    { title: "Book Title", dataIndex: ["bookCopy", "catalog", "title"], key: "title", render: (_, r) => r.bookCopy?.catalog?.title || "N/A" },
    { title: "Issue Date", dataIndex: "issueDate", key: "issueDate" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const reservationsColumns = [
    { title: "Reservation ID", dataIndex: "reservationID", key: "reservationID" },
    { title: "Book Title", dataIndex: ["catalog", "title"], key: "title", render: (_, r) => r.catalog?.title || "N/A" },
    { title: "Position", dataIndex: "queuePosition", key: "queuePosition" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const bookingsColumns = [
    { title: "Booking ID", dataIndex: "bookingID", key: "bookingID" },
    { title: "Start", dataIndex: "startTime", key: "startTime" },
    { title: "End", dataIndex: "endTime", key: "endTime" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={900} destroyOnClose>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin tip="Loading user..." />
        </div>
      ) : user ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={3} style={{ margin: 0 }}>{user.userName}</Title>
            <Tag color={ROLE_COLOR[user.role] || "default"}>{user.role}</Tag>
          </div>

          <Descriptions bordered column={1} style={{ marginTop: 12 }}>
            <Descriptions.Item label="User ID">{user.userID}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Phone">{user.phone || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Roll No">{user.rollNo || "N/A"}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <Title level={5}>Loans ({user.loans?.length || 0})</Title>
            {user.loans && user.loans.length > 0 ? (
              <Table
                columns={loansColumns}
                dataSource={user.loans.map((l) => ({ ...l, key: l.loanID }))}
                pagination={false}
                size="small"
                scroll={{ x: "max-content" }}
              />
            ) : (
              <Paragraph style={{ color: "#777" }}>No loans found</Paragraph>
            )}
          </div>

          <Divider />

          <div>
            <Title level={5}>Reservations ({user.reservations?.length || 0})</Title>
            {user.reservations && user.reservations.length > 0 ? (
              <Table
                columns={reservationsColumns}
                dataSource={user.reservations.map((r) => ({ ...r, key: r.reservationID }))}
                pagination={false}
                size="small"
                scroll={{ x: "max-content" }}
              />
            ) : (
              <Paragraph style={{ color: "#777" }}>No reservations found</Paragraph>
            )}
          </div>

          <Divider />

          <div>
            <Title level={5}>Seat Bookings ({user.seatBookings?.length || 0})</Title>
            {user.seatBookings && user.seatBookings.length > 0 ? (
              <Table
                columns={bookingsColumns}
                dataSource={user.seatBookings.map((b) => ({ ...b, key: b.bookingID }))}
                pagination={false}
                size="small"
                scroll={{ x: "max-content" }}
              />
            ) : (
              <Paragraph style={{ color: "#777" }}>No seat bookings found</Paragraph>
            )}
          </div>

          <Divider />

          <div>
            <Title level={5}>Cabin Bookings ({user.cabinBookings?.length || 0})</Title>
            {user.cabinBookings && user.cabinBookings.length > 0 ? (
              <Table
                columns={bookingsColumns}
                dataSource={user.cabinBookings.map((b) => ({ ...b, key: b.bookingID }))}
                pagination={false}
                size="small"
                scroll={{ x: "max-content" }}
              />
            ) : (
              <Paragraph style={{ color: "#777" }}>No cabin bookings found</Paragraph>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
