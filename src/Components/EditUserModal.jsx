import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Space, Button, message } from "antd";
import { updateUser, getUserById } from "../api/services/userService";
import { toast } from "react-hot-toast";

const { Option } = Select;

export default function EditUserModal({ userId, open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open && userId) fetchDetails();
    else form.resetFields();
  }, [open, userId]);

  const fetchDetails = async () => {
    setFetching(true);
    try {
      const res = await getUserById(userId);
      if (res.data?.success) {
        const user = res.data.data;
        form.setFieldsValue({
          userName: user.userName,
          phone: user.phone,
          rollNo: user.rollNo || "",
          role: user.role,
        });
      } else {
        toast.error(res.data?.message || "Failed to load user");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user");
      onClose();
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // admin can change only username, phone, rollNo, role 
      const payload = {
        userName: values.userName,
        phone: values.phone,
        rollNo: values.rollNo || null,
        role: values.role,
      };

      const res = await updateUser(userId, payload);
      if (res.data?.success) {
        toast.success(res.data.message || "User updated successfully");
        onSuccess && onSuccess();
        onClose();
      } else {
        const m = res.data?.message || "Failed to update user";
        message.error(m);
        toast.error(m);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      const m = err?.response?.data?.message || "Error updating user";
      toast.error(m);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Edit User" destroyOnClose width={600}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="userName" label="Username" rules={[{ required: true, message: "Please enter username" }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input size="large" />
        </Form.Item>

        <Form.Item name="rollNo" label="Roll Number">
          <Input size="large" />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select size="large">
            <Option value="ADMIN">Admin</Option>
            <Option value="LIBRARIAN">Librarian</Option>
            <Option value="STUDENT">Student</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Update</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
