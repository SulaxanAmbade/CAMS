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
      values.contactNo = `+91${values.contactNo}`;
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
      setIsAppointmentModalVisible(false);
      notification.success({ message: "Patient deleted successfully!" });
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || error.message,
      });
    }
  };

  const confirmDeletePatient = (patientId) => {
    Modal.confirm({
      centered: true,
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
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Place",
      dataIndex: "place",
      key: "place",
    },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
  ];

  return (
    <>
      {(user?.role === "staff") | (user?.role === "doctor") ? (
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
                setIsAppointmentModalVisible(true);
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
                <Input placeholder="Name" />
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
                <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder="Select Gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Others">Others</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Place"
                name="place"
                rules={[
                  {
                    required: true,
                    message: "Please input Place !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contact No"
                name="contactNo"
                rules={[
                  {
                    pattern: /^\d{10}$/,
                    required: true,
                    message: "Please input valid contact number!",
                  },
                ]}
              >
                <Input addonBefore="+91" maxLength={10} />
              </Form.Item>

              <Form.Item label="Medical History" name="medicalHistory">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Add Patient
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            open={isAppointmentModalVisible}
            onCancel={() => setIsAppointmentModalVisible(false)}
            footer={null}
            centered
          >
            <h3>
              Appointment History: <br />
            </h3>

            <h4>{selectedPatient?.name}</h4>
            {loading ? (
              <Spinner />
            ) : appointments.length === 0 ? (
              <p>No appointments found for this patient.</p>
            ) : (
              <Row gutter={[8, 8]}>
                {appointments.map((appt) => (
                  <Col xs={24} sm={12} md={8} lg={8} key={appt._id}>
                    <Card style={{ background: "#0000007e", color: "white" }}>
                      {moment(appt.date).format("DD MMMM YYYY")}
                      <br />
                      {appt.time}
                      <br />
                      Dr. {appt.doctorId?.name || "N/A"}
                      <br />
                      {appt.remarks || "N/A"}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            <Button
              style={{ margin: "10px 0px" }}
              type="link"
              danger
              block
              onClick={() => confirmDeletePatient(selectedPatient._id)}
            >
              Delete Patient
            </Button>
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

export default PatientManagement;
