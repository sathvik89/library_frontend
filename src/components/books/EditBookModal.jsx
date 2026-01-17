import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Space, Button, Spin, message } from "antd";
import { toast } from "react-hot-toast";
import { generateBarcode } from "@/utils/barcodeGenerator";
import { getBookById, updateBook } from "@/api/services/bookService";
import { GENRES } from "@/Constants/constants";
import BookCopiesForm from "./BookCopiesForm";

const { Option } = Select;
const { TextArea } = Input;

function EditBookModal({ bookId, open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [book, setBook] = useState(null);
  const [existingCopies, setExistingCopies] = useState([]);
  const [newCopies, setNewCopies] = useState([]);

  const fetchBookDetails = async () => {
    if (!bookId) {
      toast.error("Book ID is missing. Please try again.");
      return;
    }

    setFetching(true);
    try {
      const response = await getBookById(bookId);

      if (response.data?.success) {
        const bookData = response.data.data;
        setBook(bookData);
        const copies = bookData.bookCopies || [];
        setExistingCopies(copies);
        setNewCopies([]);

        const formValues = {
          title: bookData.title,
          authorName: bookData.authorName,
          publisher: bookData.publisher || "",
          genre: bookData.genre,
          description: bookData.description || "",
          coverImg: bookData.coverImg || "",
          ebookLink: bookData.ebookLink || "",
        };

        copies.forEach((copy, index) => {
          formValues[`barcode_${index}`] = copy.barcode || "";
          formValues[`shelf_${index}`] = copy.shelf || "";
          formValues[`status_${index}`] = copy.status || "AVAILABLE";
        });

        form.setFieldsValue(formValues);
      } else {
        toast.error(response.data?.message || "Failed to load book details.");
        onClose();
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to load book details. Please try again.";
      toast.error(errorMsg);
      message.error(errorMsg);
      onClose();
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open && bookId) {
      fetchBookDetails();
    } else {
      form.resetFields();
      setBook(null);
      setExistingCopies([]);
      setNewCopies([]);
    }
  }, [open, bookId]);

  const handleGenerateBarcode = (copyIndex, isNewCopy = false) => {
    const newBarcode = generateBarcode();
    if (isNewCopy) {
      form.setFieldValue(`new_barcode_${copyIndex}`, newBarcode);
    } else {
      form.setFieldValue(`barcode_${copyIndex}`, newBarcode);
    }
  };

  const handleAddNewCopy = () => {
    const newIndex = newCopies.length;
    setNewCopies([...newCopies, { index: newIndex }]);
  };

  const handleRemoveNewCopy = (index) => {
    const updated = newCopies.filter((_, i) => i !== index);
    updated.forEach((copy, i) => {
      copy.index = i;
    });
    setNewCopies(updated);
    form.setFieldsValue({
      [`new_barcode_${index}`]: undefined,
      [`new_shelf_${index}`]: undefined,
      [`new_status_${index}`]: undefined,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setExistingCopies([]);
    setNewCopies([]);
    onClose();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        data: {},
        copies: [],
      };
      
      if (values.title !== book.title) payload.data.title = values.title;
      if (values.authorName !== book.authorName) payload.data.authorName = values.authorName;
      if (values.publisher !== (book.publisher || "")) payload.data.publisher = values.publisher || null;
      if (values.genre !== book.genre) payload.data.genre = values.genre;
      if (values.description !== (book.description || "")) payload.data.description = values.description || null;
      if (values.coverImg !== (book.coverImg || "")) payload.data.coverImg = values.coverImg || null;
      if (values.ebookLink !== (book.ebookLink || "")) payload.data.ebookLink = values.ebookLink || null;

      if (Object.keys(payload.data).length === 0) {
        delete payload.data;
      }

      existingCopies.forEach((copy, index) => {
        const copyUpdate = {};
        let hasChanges = false;

        const barcodeValue = values[`barcode_${index}`];
        const shelfValue = values[`shelf_${index}`];
        const statusValue = values[`status_${index}`];

        if (barcodeValue !== undefined) {
          const normalizedBarcode = barcodeValue === "" ? null : barcodeValue;
          const originalBarcode = copy.barcode || null;
          if (normalizedBarcode !== originalBarcode) {
            copyUpdate.barcode = normalizedBarcode;
            hasChanges = true;
          }
        }
        if (shelfValue !== undefined && shelfValue !== (copy.shelf || "")) {
          copyUpdate.shelf = shelfValue;
          hasChanges = true;
        }
        if (statusValue !== undefined && statusValue !== copy.status) {
          copyUpdate.status = statusValue;
          hasChanges = true;
        }

        if (hasChanges) {
          copyUpdate.bookCopyID = copy.bookCopyID;
          payload.copies.push(copyUpdate);
        }
      });

      newCopies.forEach((_, index) => {
        const barcode = values[`new_barcode_${index}`];
        if (!barcode) {
          throw new Error(`Barcode is required for new copy ${index + 1}`);
        }

        payload.copies.push({
          barcode: barcode,
          shelf: values[`new_shelf_${index}`] || "Unknown",
          status: values[`new_status_${index}`] || "AVAILABLE",
        });
      });

      if (payload.copies.length === 0) {
        delete payload.copies;
      }

      if (!payload.data && !payload.copies) {
        toast.info("No changes to update");
        onClose();
        return;
      }

      const response = await updateBook(bookId, payload);

      if (response.data?.success) {
        toast.success(response.data.message || "Book updated successfully!");
        onSuccess();
        onClose();
      } else {
        const errorMsg = response.data?.message || "Failed to update book. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating book:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Error updating book. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Edit Book"
      width={800}
      footer={null}
    >
      {fetching ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" tip="Loading book details..." />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter book title" }]}
          >
            <Input placeholder="Enter book title" size="large" />
          </Form.Item>

          <Form.Item
            label="Author Name"
            name="authorName"
            rules={[{ required: true, message: "Please enter author name" }]}
          >
            <Input placeholder="Enter author name" size="large" />
          </Form.Item>

          <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: "Please select a genre" }]}
          >
            <Select
              placeholder="Select genre"
              size="large"
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
          </Form.Item>

          <Form.Item label="Publisher" name="publisher">
            <Input placeholder="Enter publisher name (optional)" size="large" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea
              placeholder="Enter book description (optional)"
              rows={3}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Cover Image URL" name="coverImg">
            <Input placeholder="Enter cover image URL (optional)" size="large" />
          </Form.Item>

          <Form.Item label="Ebook Link" name="ebookLink">
            <Input placeholder="Enter ebook link (optional)" size="large" />
          </Form.Item>

          <BookCopiesForm 
            existingCopies={existingCopies}
            newCopies={newCopies}
            onAddCopy={handleAddNewCopy}
            onRemoveCopy={handleRemoveNewCopy}
            onGenerateBarcode={handleGenerateBarcode}
          />

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default EditBookModal;

