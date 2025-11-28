import React, { useState } from "react";
import { Modal, Form, Input, Select, InputNumber, Space, Button, Divider } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { addNewBook } from "../api/services/bookService";
import { generateBarcode } from "../utils/barcodeGenerator";
import { GENRES, COPY_STATUSES } from "../Constants/constants";

const { Option } = Select;
const { TextArea } = Input;


function AddbookModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [numberOfCopies, setNumberOfCopies] = useState(0);

  const handleGenerateBarcode = (index) => {
    const newBarcode = generateBarcode();
    form.setFieldValue(`barcode_${index}`, newBarcode);
  };

  const handleCancel = () => {
    form.resetFields();
    setNumberOfCopies(0);
    onClose();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const numCopies = values.numberOfCopies || numberOfCopies;
      const copies = [];
      for (let i = 0; i < numCopies; i++) {
        const copyData = {
          barcode: values[`barcode_${i}`] || null,
          shelf: values[`shelf_${i}`] || "Unknown",
          status: values[`status_${i}`] || "AVAILABLE",
        };
        copies.push(copyData);
      }

      const payload = {
        title: values.title,
        authorName: values.authorName,
        publisher: values.publisher || null,
        genre: values.genre,
        description: values.description || null,
        coverImg: values.coverImg || null,
        ebookLink: values.ebookLink || null,
        copies: copies,
      };

      const response = await addNewBook(payload);

      if (response.data?.success) {
        toast.success(response.data.message || "Book added successfully!");
        form.resetFields();
        setNumberOfCopies(0);
        onSuccess();
        onClose();
      } else {
        const errorMsg = response.data?.message || "Failed to add book. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Error adding book. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberOfCopiesChange = (value) => {
    const numCopies = value || 0;
    setNumberOfCopies(numCopies);
    form.setFieldsValue({ numberOfCopies: numCopies });
    
    for (let i = 0; i < 100; i++) {
      if (i >= numCopies) {
        form.setFieldsValue({
          [`barcode_${i}`]: undefined,
          [`shelf_${i}`]: undefined,
          [`status_${i}`]: undefined,
        });
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Add New Book"
      width={700}
      footer={null}
    >
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

        <Divider />

        <Form.Item
          label="Number of Copies"
          name="numberOfCopies"
          rules={[
            { required: true, message: "Please enter number of copies" },
            { type: "number", min: 1, message: "At least 1 copy is required" },
          ]}
        >
          <InputNumber
            placeholder="Enter number of copies"
            min={1}
            max={100}
            style={{ width: "100%" }}
            size="large"
            onChange={handleNumberOfCopiesChange}
          />
        </Form.Item>

        {numberOfCopies > 0 && (
          <div style={{ marginTop: 16 }}>
            <Divider orientation="left">Copy Details</Divider>
            {Array.from({ length: numberOfCopies }).map((_, index) => (
              <div key={index} style={{ marginBottom: 16, padding: 16, border: "1px solid #d9d9d9", borderRadius: 4 }}>
                <h4 style={{ marginBottom: 12 }}>Copy {index + 1}</h4>
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Form.Item
                    label="Barcode"
                    name={`barcode_${index}`}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="Enter barcode, you can click the button to generate a random barcode(opt)"
                      size="large"
                      addonAfter={
                        <Button
                          type="text"
                          icon={<ReloadOutlined />}
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleGenerateBarcode(index);
                          }}
                          title="Generate barcode"
                          style={{ padding: 0 }}
                        />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Shelf Location"
                    name={`shelf_${index}`}
                    rules={[{ required: true, message: "Please enter shelf location" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="Enter shelf location" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Status"
                    name={`status_${index}`}
                    initialValue="AVAILABLE"
                    rules={[{ required: true, message: "Please select status" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select placeholder="Select status" size="large">
                      {COPY_STATUSES.map((status) => (
                        <Option key={status} value={status}>
                          {status}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Space>
              </div>
            ))}
          </div>
        )}

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Add Book
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddbookModal;