import React from "react";
import { Form, Input, Select, Space, Button, Divider } from "antd";
import { ReloadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { COPY_STATUSES } from "@/Constants/constants";

const { Option } = Select;

export default function BookCopiesForm({ 
  existingCopies, 
  newCopies, 
  onAddCopy, 
  onRemoveCopy, 
  onGenerateBarcode 
}) {
  return (
    <>
      <Divider orientation="left">Existing Copies</Divider>

      {existingCopies.length > 0 ? (
        existingCopies.map((copy, index) => (
          <div
            key={copy.bookCopyID}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #d9d9d9",
              borderRadius: 4,
            }}
          >
            <h4 style={{ marginBottom: 12 }}>Copy {index + 1} (ID: {copy.bookCopyID})</h4>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Form.Item
                label="Barcode"
                name={`barcode_${index}`}
                initialValue={copy.barcode || ""}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder="Enter barcode"
                  size="large"
                  addonAfter={
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onGenerateBarcode(index, false);
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
                initialValue={copy.shelf || ""}
                rules={[{ required: true, message: "Please enter shelf location" }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Enter shelf location" size="large" />
              </Form.Item>

              <Form.Item
                label="Status"
                name={`status_${index}`}
                initialValue={copy.status || "AVAILABLE"}
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
        ))
      ) : (
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          No existing copies found
        </p>
      )}

      <Divider orientation="left">
        New Copies
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddCopy}
          style={{ marginLeft: 12 }}
        >
          Add New Copy
        </Button>
      </Divider>

      {newCopies.length > 0 &&
        newCopies.map((copy, index) => (
          <div
            key={copy.index}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #1890ff",
              borderRadius: 4,
              backgroundColor: "#f0f8ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h4 style={{ margin: 0 }}>New Copy {index + 1}</h4>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onRemoveCopy(index)}
              >
                Remove
              </Button>
            </div>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Form.Item
                label="Barcode"
                name={`new_barcode_${index}`}
                rules={[{ required: true, message: "Barcode is required for new copies" }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder="Enter barcode (required)"
                  size="large"
                  addonAfter={
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onGenerateBarcode(index, true);
                      }}
                      title="Generate barcode"
                      style={{ padding: 0 }}
                    />
                  }
                />
              </Form.Item>

              <Form.Item
                label="Shelf Location"
                name={`new_shelf_${index}`}
                initialValue="Unknown"
                rules={[{ required: true, message: "Please enter shelf location" }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Enter shelf location" size="large" />
              </Form.Item>

              <Form.Item
                label="Status"
                name={`new_status_${index}`}
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

      {newCopies.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          Click "Add New Copy" to add additional copies
        </p>
      )}
    </>
  );
}
