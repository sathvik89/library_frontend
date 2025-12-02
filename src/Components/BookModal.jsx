import { useEffect, useState, useCallback } from "react";
import { Modal, Descriptions, Tag, Space, Typography, Divider, Button, Spin, message } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { getBookById } from "../api/services/bookService";
import { reserveBook } from "../api/services/reservationService";
import styles from "../Styles/BookModal.module.css";

const { Title, Paragraph } = Typography;

function BookModal({ bookId, open, onClose }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reserving, setReserving] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    if (!bookId) return;
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
  }, [bookId, onClose]);

  useEffect(() => {
    if (open && bookId) {
      fetchBookDetails();
    } else {
      setBook(null);
    }
  }, [open, bookId, fetchBookDetails]);

  const handleReserveBook = async () => {
    if (!bookId) {
      toast.error("Book ID is missing.");
      return;
    }

    setReserving(true);
    try {
      const response = await reserveBook(bookId);
      
      if (response.data?.success) {
        const successMsg = response.data?.message || "Book reserved successfully!";
        toast.success(successMsg);
      } else {
        const errorMsg = response.data?.message || "Failed to reserve book.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error reserving book:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reserve book. Please try again.";
      toast.error(errorMsg);
    } finally {
      setReserving(false);
    }
  };

  if (!open) return null;

  const imageUrl = book?.coverImg || "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modal}
      centered
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" tip="Loading book details..." />
        </div>
      ) : book ? (
        <div className={styles.modalContent}>
          <div className={styles.imageSection}>
            <img
              src={imageUrl}
              alt={book.title}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
              }}
            />
          </div>

          <div className={styles.detailsSection}>
            <Title level={2} className={styles.modalTitle}>
              {book.title}
            </Title>

            <Divider />

            <Descriptions column={1} bordered size="small" className={styles.descriptions}>
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
              {/* <Descriptions.Item
                label={
                  <Space>
                    <FileTextOutlined />
                    <span>Queue Position</span>
                  </Space>
                }
              > <Tag color="blue">
                {reservation.queuePosition}
                </Tag></Descriptions.Item> */}
            </Descriptions>


            <div style={{ marginTop: "16px" }}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleReserveBook}
                loading={reserving}
                size="large"
                block
              >
                Reserve Book
              </Button>
            </div>

          {book.description && (
            <>
              <Divider />
              <div className={styles.descriptionSection}>
                <Title level={4}>Description</Title>
                <Paragraph className={styles.descriptionText}>
                  {book.description}
                </Paragraph>
              </div>
            </>
          )}

          {book.bookCopies && book.bookCopies.length > 0 && (
            <>
              <Divider />
              <div className={styles.copiesSection}>
                <Title level={4}>
                  <BarcodeOutlined /> Book Copies Details
                </Title>
                <div className={styles.copiesList}>
                  {book.bookCopies.map((copy, index) => (
                    <div key={index} className={styles.copyItem}>
                      <Space>
                        <Tag color={copy.status === "AVAILABLE" ? "green" : "red"}>
                          {copy.status}
                        </Tag>
                        <span>
                          <strong>Barcode:</strong> {copy.barcode || "N/A"}
                        </span>
                        <span>
                          <strong>Shelf:</strong> {copy.shelf || "N/A"}
                        </span>
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {book.ebookLink && (
            <>
              <Divider />
              <div className={styles.ebookSection}>
                <a href={book.ebookLink} target="_blank" rel="noopener noreferrer" className={styles.ebookLink}>
                  View E-Book
                </a>
              </div>
            </>
          )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

export default BookModal;

