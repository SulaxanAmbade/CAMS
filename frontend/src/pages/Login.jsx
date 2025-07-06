import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../css/register.css";
//https://cams-qgq9.onrender.com
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [staffData, setStaffData] = useState([]);

  const [staffloginshow, setStaffLoginShow] = useState(false);
  const [doctorCard, setDoctorCard] = useState(false);
  const [patientCard, setPatientCard] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const fetchStaff = async () => {
    try {
      const response = await fetch(
        "https://cams-qgq9.onrender.com/api/v1/staff/getAllStaff"
      );
      if (!response.ok) throw new Error("Failed to fetch staff");
      const data = await response.json();
      setStaffData(data.data || []);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const handleRegister = () => {
    setRegisterModal(true);
    fetchStaff();
  };
  // Staff Login Handler
  const onSubmitStaffLogin = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/staff/login",
        values
      );
      dispatch(hideLoading());

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success(response.data.message);
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Doctor Login Handler
  const onSubmitDoctorLogin = async (values) => {
    try {
      const response = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/doctor/login",
        values
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success("Doctor login successful!");
        navigate("/");
      } else {
        message.error(response.data.message || "Invalid phone number.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Patient Login Handler
  const onSubmitPatientLogin = async (values) => {
    try {
      const response = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/patient/login",
        values
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success("Patient login successful!");
        navigate("/");
      } else {
        message.error(response.data.message || "Invalid phone number.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const StaffColumn = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
  ];

  return (
    <div className="formContainer">
      <Card className="loginCard" style={{}}>
        <h4>Welcome to </h4>
        <h2 style={{ textAlign: "center", marginLeft: "10px" }}>
          <b style={{ color: "gold" }}>C</b>linical{" "}
          <b style={{ color: "gold" }}>A</b>ppointment{" "}
          <b style={{ color: "gold" }}>M</b>anagement{" "}
          <b style={{ color: "gold" }}>S</b>ystem
        </h2>
        <hr />
        <h5>Login as</h5>
        <div className="logButtonDiv">
          {" "}
          <Button
            type="text"
            className="LogButton"
            onClick={() => setDoctorCard(true)}
          >
            DOCTOR
          </Button>
          <Button
            type="text"
            className="LogButton"
            onClick={() => setPatientCard(true)}
          >
            PATIENT
          </Button>
          <Button
            type="text"
            className="LogButton"
            onClick={() => setStaffLoginShow(true)}
          >
            STAFF
          </Button>
        </div>

        <div>
          {" "}
          <Button
            type="text"
            onClick={handleRegister}
            style={{ color: "#291806" }}
          >
            Registration details
          </Button>
        </div>
      </Card>

      {/* Staff Login Modal */}
      <Modal
        open={staffloginshow}
        onCancel={() => setStaffLoginShow(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitStaffLogin}>
          <h3 style={{ textAlign: "center", color: "#291806" }}>Staff Login</h3>
          <Form.Item
            label="Phone Number"
            name="contactNo"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^\+91\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input placeholder="XXXXXXXXXX" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ textAlign: "center", background: "#4d2a05" }}
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Doctor Login Modal */}
      <Modal
        open={doctorCard}
        onCancel={() => setDoctorCard(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitDoctorLogin}>
          <h3 style={{ textAlign: "center", color: "#291806" }}>
            Doctor Login
          </h3>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^\+91\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input placeholder="XXXXXXXXXX" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ textAlign: "center", background: "#4d2a05" }}
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Patient Login Modal */}
      <Modal
        open={patientCard}
        onCancel={() => setPatientCard(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitPatientLogin}>
          <h3 style={{ textAlign: "center", color: "#291806" }}>
            Patient Login
          </h3>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^\+91\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input placeholder="XXXXXXXXXX" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ textAlign: "center", background: "#4d2a05" }}
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={registerModal}
        onCancel={() => {
          setRegisterModal(false);
        }}
        footer={null}
        centered
      >
        <p>CONTACT :</p>
        <Table dataSource={staffData} columns={StaffColumn}></Table>
      </Modal>
    </div>
  );
};

export default Login;
