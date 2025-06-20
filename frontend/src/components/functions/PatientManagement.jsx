import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Select,
  notification as message,
  DatePicker,
  Card,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const PatientManagement = () => {
  const { user } = useSelector((state) => state.user);
  const [patientData, setPatientData] = useState([]);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] =
    useState(false);
  const [appointments, setAppointments] = useState([]);

  const [patientForm] = Form.useForm();
  const { Option } = Select;
  const fetchAppointments = async (patientId) => {
    try {
      const response = await fetch(
        `https://cams-qgq9.onrender.com/api/v1/appointment/getAppointmentsByPatientId/${patientId}`
      );
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data.data || []);
      setIsAppointmentModalVisible(true);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("https://cams-qgq9.onrender.com/api/v1/patient/getAllPatient");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatientData(data.data || []);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (values) => {
    try {
      const response = await fetch("https://cams-qgq9.onrender.com/api/v1/patient/addNewPatient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to add patient");
      const newPatient = await response.json();
      setPatientData([...patientData, newPatient.data]);
      setIsPatientModalVisible(false);
      patientForm.resetFields();
      message.success({ message: "Patient added successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await fetch(
        `https://cams-qgq9.onrender.com/api/v1/patient/deletePatient/${patientId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete patient");
      setPatientData(
        patientData.filter((patient) => patient._id !== patientId)
      );
      message.success({ message: "Patient deleted successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };
  const confirmDeletePatient = (patientId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this doctor?",
      content: "This action cannot be undone.",
      onOk() {
        handleDeletePatient(patientId);
      },
      onCancel() {},
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
    {
      title: "Emergency Contact",
      dataIndex: "emergencyContact",
      key: "emergencyContact",
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => confirmDeletePatient(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const navigate = useNavigate();

  return (
    <>
      {user?.role === "Staff" ? (
        <>
          {" "}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {" "}
            <Button
              style={{ background: "#b7202eee", color: "white" }}
              size="large"
              onClick={() => navigate("/")}
            >
              <ArrowLeftOutlined />
            </Button>
            <Button
              style={{ background: "#b7202eee", color: "white" }}
              onClick={() => setIsPatientModalVisible(true)}
            >
              Add New Patient
            </Button>
          </div>
          <Table
            dataSource={patientData}
            columns={columns}
            pagination={false}
            rowKey="_id"
            onRow={(record) => {
              return {
                onClick: () => {
                  setSelectedPatient(record);
                  fetchAppointments(record._id);
                },
              };
            }}
          />
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
                rules={[
                  {
                    required: true,
                    message: "Please input the patient's name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please input the patient's date of birth!",
                  },
                ]}
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
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please input the gender!",
                  },
                ]}
              >
                <Select placeholder="Select your gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Others">Others</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Contact No"
                name="contactNo"
                rules={[
                  {
                    pattern: /^\+91\d{10}$/,
                    required: true,
                    message: "Please input the patient's contact number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Emergency Contact"
                name="emergencyContact"
                rules={[
                  {
                    pattern: /^\+91\d{10}$/,
                    required: true,
                    message: "Please input the emergency contact!",
                  },
                ]}
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
          <Modal
            title={`Appointment History: ${selectedPatient?.name}`}
            open={isAppointmentModalVisible}
            onCancel={() => setIsAppointmentModalVisible(false)}
            footer={null}
            centered
            width="50vw"
          >
            {appointments.length === 0 ? (
              <p>No appointments found for this patient.</p>
            ) : (
              <Row gutter={[8, 8]}>
                {appointments.map((appt) => (
                  <Col xs={48} sm={24} md={16} lg={12} key={appt._id}>
                    <Card key={appt._id}>
                      <strong>Date:</strong>{" "}
                      {moment(appt.date).format("DD MMMM YYYY")}
                      <br />
                      <strong>Time:</strong> {appt.time}
                      <br />
                      <strong>Doctor:</strong> {appt.doctorId.name}
                      <br />
                      <strong>Remark:</strong> {appt.remarks || "N/A"}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Modal>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "red" }}>
            ERROR 404 : Sorry You Don't have Access to the Page
          </h2>
        </div>
      )}
    </>
  );
};

export default PatientManagement;
