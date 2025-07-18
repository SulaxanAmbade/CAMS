import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Card,
  notification,
  Select,
  TimePicker,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

export const StaffManagement = () => {
  const { user } = useSelector((state) => state.user);
  const [staffData, setStaffData] = useState([]);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [staffForm] = Form.useForm();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();
  const { Option } = Select;

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact", dataIndex: "contactNo", key: "contactNo" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => confirmDeleteStaff(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/staff/getAllStaff`
      );
      setStaffData(res.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to fetch doctors",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleAddStaff = async (values) => {
    try {
      values.contactNo = `+91${values.contactNo}`;
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/staff/register`,
        values
      );
      setStaffData([...staffData, res.data.data]);
      setIsStaffModalVisible(false);
      staffForm.resetFields();
      notification.success({ message: "Staff added successfully!" });
    } catch (error) {
      notification.error({
        message: "Failed to add Staff",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/v1/staff/staffDelete/${staffId}`
      );
      setStaffData(staffData.filter((staff) => staff._id !== staffId));
      notification.success({ message: "Staff deleted successfully!" });
    } catch (error) {
      notification.error({
        message: "Failed to delete Staff",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const confirmDeleteStaff = (staffId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this staff?",
      content: "This action cannot be undone.",
      onOk() {
        handleDeleteStaff(staffId);
      },
    });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <>
      {user?.role === "doctor" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              style={{ background: "#3E2B20", color: "white" }}
              size="large"
              onClick={() => navigate("/")}
            >
              <ArrowLeftOutlined />
            </Button>
            <Button
              style={{ background: "#3E2B20", color: "white" }}
              onClick={() => setIsStaffModalVisible(true)}
            >
              Add New Staff
            </Button>
          </div>

          <Table
            dataSource={staffData}
            columns={columns}
            rowKey="_id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => {
                setSelectedStaff(record);
              },
            })}
          />

          <Modal
            open={isStaffModalVisible}
            onCancel={() => setIsStaffModalVisible(false)}
            footer={null}
            centered
          >
            <h3>Add New Staff</h3>
            <Form form={staffForm} onFinish={handleAddStaff} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input the Staff's name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contact"
                name="contactNo"
                rules={[
                  { required: true, message: "Please input contact!" },
                  {
                    pattern: /^\d{10}$/,
                    message: "Invalid phone number format!",
                  },
                ]}
              >
                <Input addonBefore="+91" maxLength={10} />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input the Staff's password!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Staff
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "red" }}>
            ERROR 404 : Sorry You Don't have Access to the Page
          </h2>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
        </div>
      )}
    </>
  );
};

export default StaffManagement;
