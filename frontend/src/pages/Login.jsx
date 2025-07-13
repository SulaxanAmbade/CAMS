import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../css/register.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [staffData, setStaffData] = useState([]);

  const [staffloginshow, setStaffLoginShow] = useState(false);
  const [doctorCard, setDoctorCard] = useState(false);
  const [patientCard, setPatientCard] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  // NEW STATE FOR MOBILE TOGGLE
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/v1/staff/getAllStaff`
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

  const onSubmitStaffLogin = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/staff/login`,
        values
      );
      dispatch(hideLoading());

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success(response.data.message);
        navigate("/splash");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const onSubmitDoctorLogin = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/doctor/login`,
        values
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success("Doctor login successful!");
        navigate("/splash");
      } else {
        message.error(response.data.message || "Invalid phone number.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const onSubmitPatientLogin = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/login`,
        values
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        message.success("Patient login successful!");
        navigate("/splash");
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

  useEffect(() => {
    console.log("Backend URL:", process.env.REACT_APP_BACKEND);
  }, []);

  return (
    <div className="formContainer">
      <Card className="loginCard">
        {/* Welcome Text - Hidden on mobile when login toggled */}
        {!showLoginOptions && (
          <div className="welcome-text">
            <h1 style={{ color: "#423328", fontWeight: "bold" }}>
              Dhanvantari Ayurveda's
            </h1>
            <h4 style={{ textAlign: "center", marginLeft: "10px" }}>
              <b>C</b>linical <b>A</b>ppointment <b>M</b>anagement <b>S</b>ystem
            </h4>
            <hr />
          </div>
        )}

        {/* Mobile: Show "Login as" button initially */}
        {!showLoginOptions && (
          <>
            <Button
              size="large"
              type="text"
              block
              centered
              style={{ color: "#085042" }}
              onClick={() => setShowLoginOptions(true)}
            >
              Login
            </Button>

            <div>
              <Button
                type="text"
                onClick={handleRegister}
                style={{
                  color: "#085042",
                  textShadow: "1px 1px 0 #ffffff20,-1px -1px 2px #00000070",
                }}
              >
                Registration details
              </Button>
            </div>
          </>
        )}
        {/* Mobile: Show login options after click */}
        {showLoginOptions && (
          <>
            <h5 onClick={() => setShowLoginOptions(true)}>Login as</h5>
            <div className="logButtonDiv">
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
          </>
        )}
      </Card>

      {/* Modals remain unchanged */}
      <Modal
        open={staffloginshow}
        onCancel={() => setStaffLoginShow(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitStaffLogin}>
          <h3 style={{ textAlign: "center" }}>Staff Login</h3>
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

      <Modal
        open={doctorCard}
        onCancel={() => setDoctorCard(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitDoctorLogin}>
          <h3 style={{ textAlign: "center" }}>Doctor Login</h3>
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

      <Modal
        open={patientCard}
        onCancel={() => setPatientCard(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={onSubmitPatientLogin}>
          <h3 style={{ textAlign: "center" }}>Patient Login</h3>
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
        onCancel={() => setRegisterModal(false)}
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
