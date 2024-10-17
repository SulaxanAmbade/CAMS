import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  notification as message,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment for date handling

export const StaffDashboard = () => {
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]); // State for doctors
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [patientForm] = Form.useForm();
  const [doctorForm] = Form.useForm(); // Form for doctors

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/v1/staff/getAllPatient");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatientData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/v1/staff/getAllDoctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctorData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  useEffect(() => {
    fetchPatients(); // Fetch patients when the component mounts
    fetchDoctors(); // Fetch doctors when the component mounts
  }, []);

  const handleAddPatient = async (values) => {
    try {
      const response = await fetch("/api/v1/staff/addNewPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      const newPatient = await response.json();
      setPatientData([...patientData, newPatient.data]);
      setIsPatientModalVisible(false);
      patientForm.resetFields();
      message.success({ message: "Patient added successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const handleAddDoctor = async (values) => {
    try {
      const response = await fetch("/api/v1/staff/addNewDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor");
      }

      const newDoctor = await response.json();
      setDoctorData([...doctorData, newDoctor.data]);
      setIsDoctorModalVisible(false);
      doctorForm.resetFields();
      message.success({ message: "Doctor added successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!patientId) {
      message.error({ message: "Invalid patient ID!" });
      return;
    }
    try {
      const response = await fetch(`/api/v1/staff/deletePatient/${patientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      setPatientData(patientData.filter((patient) => patient._id !== patientId));
      message.success({ message: "Patient deleted successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => moment(text).format("YYYY-MM-DD"), // Format the date for display
    },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
    {
      title: "Emergency Contact",
      dataIndex: "emergencyContact",
      key: "emergencyContact",
    },
    {
      title: "Medical History",
      dataIndex: "medicalHistory",
      key: "medicalHistory",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDeletePatient(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const doctorColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialty", dataIndex: "specialty", key: "specialty" },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsPatientModalVisible(true)}>
        Add New Patient
      </Button>
      <Button type="primary" onClick={() => setIsDoctorModalVisible(true)}>
        Add New Doctor
      </Button>

      <Table dataSource={patientData} columns={columns} pagination={false} />

      <h3>Available Doctors</h3>
      <Table dataSource={doctorData} columns={doctorColumns} pagination={false} />

      {/* Modal for Adding New Patient */}
      <Modal
        title="Add New Patient"
        open={isPatientModalVisible}
        onCancel={() => setIsPatientModalVisible(false)}
        footer={null}
      >
        <Form form={patientForm} onFinish={handleAddPatient}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the patient's name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Please input the patient's date of birth!" }]}
          >
            <DatePicker
              onChange={(date) => {
                if (date) {
                  patientForm.setFieldsValue({ dateOfBirth: date });
                } else {
                  patientForm.setFieldsValue({ dateOfBirth: null });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Contact No"
            name="contactNo"
            rules={[{ required: true, message: "Please input the patient's contact number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Emergency Contact"
            name="emergencyContact"
            rules={[{ required: true, message: "Please input the emergency contact!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Medical History" name="medicalHistory">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Patient
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Adding New Doctor */}
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
            rules={[{ required: true, message: "Please input the doctor's name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Please input the doctor's specialty!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact No"
            name="contactNo"
            rules={[{ required: true, message: "Please input the doctor's contact number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the doctor's email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StaffDashboard;
