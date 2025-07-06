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
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

export const DoctorManagement = () => {
  const [doctorData, setDoctorData] = useState([]);
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [doctorForm] = Form.useForm();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDetailsModal, setShowDoctorDetailsModal] = useState(false);
  const [visitingTimeStrings, setVisitingTimeStrings] = useState({
    start: "",
    end: "",
  });
  const navigate = useNavigate();
  const { Option } = Select;

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Visiting Hours Start",
      dataIndex: ["visitingHours", "start"],
      key: "visitingHours.start",
    },
    {
      title: "Visiting Hours End",
      dataIndex: ["visitingHours", "end"],
      key: "visitingHours.end",
    },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => confirmDeleteDoctor(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("https://cams-qgq9.onrender.com/api/v1/doctor/getAllDoctors");
      setDoctorData(res.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to fetch doctors",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (values) => {
    try {
      if (!visitingTimeStrings.start || !visitingTimeStrings.end) {
        notification.error({
          message: "Please select both start and end times!",
        });
        return;
      }

      const visitingHours = {
        start: visitingTimeStrings.start,
        end: visitingTimeStrings.end,
        slot: values.slotsDuration,
      };

      const doctorDataToSend = {
        name: values.name,
        password: values.password,
        specialization: values.specialization,
        contact: values.contact,
        visitingHours,
      };

      const res = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/doctor/addNewDoctor",
        doctorDataToSend
      );
      setDoctorData([...doctorData, res.data.data]);
      setIsDoctorModalVisible(false);
      doctorForm.resetFields();
      setVisitingTimeStrings({ start: "", end: "" });
      notification.success({ message: "Doctor added successfully!" });
    } catch (error) {
      notification.error({
        message: "Failed to add doctor",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`https://cams-qgq9.onrender.com/api/v1/doctor/deleteDoctor/${doctorId}`);
      setDoctorData(doctorData.filter((doc) => doc._id !== doctorId));
      notification.success({ message: "Doctor deleted successfully!" });
    } catch (error) {
      notification.error({
        message: "Failed to delete doctor",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const confirmDeleteDoctor = (doctorId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this doctor?",
      content: "This action cannot be undone.",
      onOk() {
        handleDeleteDoctor(doctorId);
      },
    });
  };

  return (
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
          onClick={() => setIsDoctorModalVisible(true)}
        >
          Add New Doctor
        </Button>
      </div>

      <Table
        dataSource={doctorData}
        columns={columns}
        rowKey="_id"
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            setSelectedDoctor(record);
            setShowDoctorDetailsModal(true);
          },
        })}
      />

      <Modal
        title="Add New Doctor"
        open={isDoctorModalVisible}
        onCancel={() => setIsDoctorModalVisible(false)}
        footer={null}
      >
        <Form form={doctorForm} onFinish={handleAddDoctor} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the doctor's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the doctor's password!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              { required: true, message: "Please input specialization!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact"
            name="contact"
            rules={[
              { required: true, message: "Please input contact!" },
              {
                pattern: /^\+91\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Visiting Hours"
            name="visitingHours"
            rules={[
              { required: true, message: "Please select visiting hours!" },
            ]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              onChange={(time, timeString) => {
                setVisitingTimeStrings({
                  start: timeString[0],
                  end: timeString[1],
                });
                doctorForm.setFieldsValue({ visitingHours: time });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Slot Duration (minutes)"
            name="slotsDuration"
            rules={[{ required: true, message: "Please enter slot duration!" }]}
          >
            <InputNumber min={1} max={180} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Doctor Details"
        open={showDoctorDetailsModal}
        onCancel={() => setShowDoctorDetailsModal(false)}
        footer={null}
      >
        <Card>
          <p>
            <b>Name:</b> {selectedDoctor?.name}
          </p>
          <p>
            <b>Specialization:</b> {selectedDoctor?.specialization}
          </p>
          <p>
            <b>Contact:</b> {selectedDoctor?.contact}
          </p>
          <p>
            <b>Visiting Hours:</b>{" "}
            {`${selectedDoctor?.visitingHours?.start} - ${selectedDoctor?.visitingHours?.end}`}
          </p>
        </Card>
      </Modal>
    </>
  );
};

export default DoctorManagement;
