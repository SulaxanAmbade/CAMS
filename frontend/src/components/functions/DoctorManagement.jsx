import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Card,
  notification as message,
  Select,
  TimePicker,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DoctorSchedule from "./DoctorSchedule";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
      const response = await fetch("/api/v1/doctor/getAllDoctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctorData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (values) => {
    try {
      console.log("Form values:", values);

      if (!visitingTimeStrings.start || !visitingTimeStrings.end) {
        message.error({ message: "Please select both start and end times!" });
        return;
      }

      const visitingHours = {
        start: visitingTimeStrings.start,
        end: visitingTimeStrings.end,
        slot: values.slotsDuration,
      };

      console.log("Visiting Hours:", visitingHours);

      const doctorDataToSend = {
        name: values.name,
        password: values.password,
        specialization: values.specialization,
        contact: values.contact || "",
        visitingHours, // Use the formatted visiting hours
      };

      console.log("Doctor Data to be sent to DB:", doctorDataToSend);

      const response = await fetch("/api/v1/doctor/addNewDoctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorDataToSend),
      });

      if (!response.ok) throw new Error("Failed to add doctor");

      const newDoctor = await response.json();
      setDoctorData([...doctorData, newDoctor.data]);
      setIsDoctorModalVisible(false);
      doctorForm.resetFields();
      setVisitingTimeStrings({ start: "", end: "" }); // Reset the time strings
      fetchDoctors();
      message.success({ message: "Doctor added successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const confirmDeleteDoctor = (doctorId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this doctor?",
      content: "This action cannot be undone.",
      onOk() {
        handleDeleteDoctor(doctorId);
      },
      onCancel() {},
    });
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`/api/v1/doctor/deleteDoctor/${doctorId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete doctor");

      // Remove the deleted doctor from the state
      setDoctorData(doctorData.filter((doctor) => doctor._id !== doctorId));
      message.success({ message: "Doctor deleted successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          style={{ background: "#b7202eee", color: "white" }}
          size="large"
          onClick={() => navigate("/")}
        >
          <ArrowLeftOutlined />
        </Button>
        <Button
          style={{ background: "#b7202eee", color: "white" }}
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
        <Form form={doctorForm} onFinish={handleAddDoctor}>
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
                message: "Please input the doctor's Password!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              {
                required: true,
                message: "Please input the doctor's specialization!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact"
            name="contact"
            rules={[
              { required: true, message: "Please input your phone number!" },
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
                console.log(timeString[0], timeString[1]);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Slot Duration"
            name="slotsDuration"
            rules={[
              { required: true, message: "Please enter duration in Minutes!" },
            ]}
          >
            <InputNumber maxLength={3} />
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
