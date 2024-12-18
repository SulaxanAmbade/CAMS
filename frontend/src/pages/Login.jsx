import React, { useState } from "react";
import { Button, Card, Form, Input, Modal, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../css/register.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [staffloginshow, setStaffLoginShow] = useState(false);
  const [doctorCard, setDoctorCard] = useState(false);
  const [patientCard, setPatientCard] = useState(false);

  // Staff Login Handler
  const onSubmitStaffLogin = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        const userData = response.data.user;

        if (!userData.profileCompleted) {
          message.warning("Please complete your profile.");
          navigate("/comProfile");
        } else {
          message.success(response.data.message);
          navigate("/");
        }
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
      const response = await axios.post("/api/v1/doctor/login", values);
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
      const response = await axios.post("/api/v1/patient/login", values);
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

  return (
    <div className="formContainer">
      <Card
        style={{
          background: "#b7202e",
          width: "50vh",
          textAlign: "center",
          color: "white",
        }}
      >
        <h4>Welcome to </h4>
        <h2>Clinical Appointment Management System</h2>
        <h5>Login as</h5>
        <Button className="LogButton" onClick={() => setDoctorCard(true)}>
          DOCTOR
        </Button>
        <Button className="LogButton" onClick={() => setPatientCard(true)}>
          PATIENT
        </Button>
        <Button className="LogButton" onClick={() => setStaffLoginShow(true)}>
          STAFF
        </Button>
      </Card>

      {/* Staff Login Modal */}
      <Modal
        open={staffloginshow}
        onCancel={() => setStaffLoginShow(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitStaffLogin}>
          <h3 style={{ textAlign: "center", color: "#b7202e" }}>Staff Login</h3>
          <Form.Item
            label="Phone Number"
            name="contactNo"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\d{10}$/, message: "Invalid phone number format!" },
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
              style={{ textAlign: "center", background: "#b7202e" }}
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
          <h3 style={{ textAlign: "center", color: "#b7202e" }}>
            Doctor Login
          </h3>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\d{10}$/, message: "Invalid phone number format!" },
            ]}
          >
            <Input placeholder="XXXXXXXXXX" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ textAlign: "center", background: "#b7202e" }}
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
          <h3 style={{ textAlign: "center", color: "#b7202e" }}>
            Patient Login
          </h3>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\d{10}$/, message: "Invalid phone number format!" },
            ]}
          >
            <Input placeholder="XXXXXXXXXX" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ textAlign: "center", background: "#b7202e" }}
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
