import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Tag, Space, Typography, Divider, Table, Spin, message } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  BarcodeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { getBookById } from "../api/services/bookService";

const { Title, Paragraph } = Typography;

const COPY_STATUS_COLORS = {
  AVAILABLE: "green",
  LOANED: "blue",
  DAMAGED: "orange",
  LOST: "red",
};

const RESERVATION_STATUS_COLORS = {
  ACTIVE: "green",
  FULFILLED: "blue",
  CANCELLED: "red",
};

function BookDetailsModal({ bookId, open, onClose }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && bookId) {
      fetchBookDetails();
    } else {
      setBook(null);
    }
  }, [open, bookId]);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const response = await getBookById(bookId);

      if (response.data?.success) {
        setBook(response.data.data);
      } else {
        const errorMsg = response.data?.message || "Failed to load book details.";
        toast.error(errorMsg);
        message.error(errorMsg);
        onClose();
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load book details. Please try again.";
      toast.error(errorMsg);
      message.error(errorMsg);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const bookCopiesColumns = [
    {
      title: "Copy ID",
      dataIndex: "bookCopyID",
      key: "bookCopyID",
      width: "15%",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: "20%",
      render: (text) => text || "N/A",
    },
    {
      title: "Shelf Location",
      dataIndex: "shelf",
      key: "shelf",
      width: "20%",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status) => (
        <Tag color={COPY_STATUS_COLORS[status] || "default"}>
          {status || "N/A"}
        </Tag>
      ),
    },
  ];

  const reservationsColumns = [
    {
      title: "Reservation ID",
      dataIndex: "reservationID",
      key: "reservationID",
      width: "15%",
    },
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
      width: "15%",
    },
    {
      title: "Queue Position",
      dataIndex: "queuePosition",
      key: "queuePosition",
      width: "15%",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={RESERVATION_STATUS_COLORS[status] || "default"}>
          {status || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: "10%",
      align: "center",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Yes" : "No"}</Tag>
      ),
    },
  ];

  if (!open) return null;

  const imageUrl = book?.coverImg || "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" tip="Loading book details..." />
        </div>
      ) : book ? (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ flexShrink: 0 }}>
              <img
                src={imageUrl}
                alt={book.title}
                style={{
                  width: "200px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <Title level={2} style={{ marginBottom: "16px" }}>
                {book.title}
              </Title>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined />
                      <span>Author</span>
                    </Space>
                  }
                >
                  {book.authorName || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <ShopOutlined />
                      <span>Publisher</span>
                    </Space>
                  }
                >
                  {book.publisher || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <BookOutlined />
                      <span>Genre</span>
                    </Space>
                  }
                >
                  <Tag color="blue">
                    {book.genre ? book.genre.replace(/_/g, " ") : "N/A"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <FileTextOutlined />
                      <span>Total Copies</span>
                    </Space>
                  }
                >
                  {book.totalCopies || 0}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <Space>
                      <FileTextOutlined />
                      <span>Available Copies</span>
                    </Space>
                  }
                >
                  <Tag color={book.availableCopies > 0 ? "green" : "red"}>
                    {book.availableCopies || 0}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {book.description && (
                <>
                  <Divider />
                  <div>
                    <Title level={5}>Description</Title>
                    <Paragraph>{book.description}</Paragraph>
                  </div>
                </>
              )}

              {book.ebookLink && (
                <>
                  <Divider />
                  <div>
                    <a
                      href={book.ebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1890ff" }}
                    >
                      View E-Book
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {book.bookCopies && book.bookCopies.length > 0 && (
            <>
              <Divider />
              <div>
                <Title level={4}>
                  <BarcodeOutlined /> Book Copies ({book.bookCopies.length})
                </Title>
                <Table
                  columns={bookCopiesColumns}
                  dataSource={book.bookCopies.map((copy) => ({
                    ...copy,
                    key: copy.bookCopyID,
                  }))}
                  pagination={false}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </div>
            </>
          )}

          {book.reservations && book.reservations.length > 0 && (
            <>
              <Divider />
              <div>
                <Title level={4}>
                  <ClockCircleOutlined /> Reservations ({book.reservations.length})
                </Title>
                <Table
                  columns={reservationsColumns}
                  dataSource={book.reservations.map((reservation) => ({
                    ...reservation,
                    key: reservation.reservationID,
                  }))}
                  pagination={false}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </div>
            </>
          )}

          {(!book.bookCopies || book.bookCopies.length === 0) && (
            <Divider />
          )}
          {(!book.reservations || book.reservations.length === 0) && (
            <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
              No reservations found for this book.
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}

export default BookDetailsModal;

