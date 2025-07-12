import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Select,
  notification,
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
import axios from "axios";
import Spinner from "../requirements/Spinner";

export const PatientManagement = () => {
  const { user } = useSelector((state) => state.user);
  const [patientData, setPatientData] = useState([]);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] =
    useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientForm] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();

  const fetchAppointments = async (patientId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/getAppointmentsByPatientId/${patientId}`
      );
      setAppointments(res.data.data);
      setIsAppointmentModalVisible(true);
    } catch (err) {
      notification.error({
        message: "No Appointments Found",
        description:
          "There are currently no appointments scheduled for this patient. Once appointments are made, they will appear here.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/getAllPatient`
      );
      setPatientData(res.data.data);
    } catch {
      notification.error({ message: "Failed to fetch patients." });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/addNewPatient`,
        values
      );
      setPatientData([...patientData, response.data.data]);
      setIsPatientModalVisible(false);
      patientForm.resetFields();
      notification.success({ message: "Patient added successfully!" });
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || error.message,
      });
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/deletePatient/${patientId}`
      );
      setPatientData(
        patientData.filter((patient) => patient._id !== patientId)
      );
      notification.success({ message: "Patient deleted successfully!" });
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || error.message,
      });
    }
  };

  const confirmDeletePatient = (patientId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this patient?",
      content: "This action cannot be undone.",
      onOk() {
        handleDeletePatient(patientId);
      },
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

  return (
    <>
      {user?.role === "staff" ? (
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
            onRow={(record) => ({
              onClick: () => {
                setSelectedPatient(record);
                fetchAppointments(record._id);
              },
            })}
          />

          <Modal
            open={isPatientModalVisible}
            onCancel={() => setIsPatientModalVisible(false)}
            footer={null}
            centered
          >
            <h4>Add New Patient</h4>
            <Form
              form={patientForm}
              onFinish={handleAddPatient}
              layout="vertical"
            >
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
                    message: "Please input the date of birth!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select>
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
                    message: "Please input valid contact number!",
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
                    message: "Please input valid emergency contact!",
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
          >
            {loading ? (
              <Spinner />
            ) : appointments.length === 0 ? (
              <p>No appointments found for this patient.</p>
            ) : (
              <Row gutter={[8, 8]}>
                {appointments.map((appt) => (
                  <Col xs={24} sm={12} md={8} lg={8} key={appt._id}>
                    <Card>
                      <strong>Date:</strong>{" "}
                      {moment(appt.date).format("DD MMMM YYYY")}
                      <br />
                      <strong>Time:</strong> {appt.time}
                      <br />
                      <strong>Doctor:</strong> {appt.doctorId?.name || "N/A"}
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
