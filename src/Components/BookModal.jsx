import { Modal, Descriptions, Tag, Space, Typography, Divider } from "antd";
import { BookOutlined, UserOutlined, ShopOutlined, FileTextOutlined, BarcodeOutlined } from "@ant-design/icons";
import styles from "../Styles/BookModal.module.css";

const { Title, Paragraph } = Typography;

function BookModal({ book, open, onClose }) {
  if (!book) return null;

  const imageUrl = book.coverImg || "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modal}
      centered
    >
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
              <Tag color="blue">{book.genre || "N/A"}</Tag>
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
    </Modal>
  );
}

export default BookModal;

