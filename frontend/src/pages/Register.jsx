import React from "react";
import { Button, Form, Input, Select, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/register.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onSubmithandle = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        message.success("Registered Successfully!!");
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Registration failed, please try again.");
      form.resetFields();
    }
  };

  return (
    <div className="formContainer">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmithandle}
        className="registerForm"
      >
        <h3 style={{ textAlign: "center", color: "bisque" }}>Register</h3>

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
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select your role!" }]}
        >
          <Select placeholder="Select your role">
            <Option value="Staff">Staff</Option>
            <Option value="Doctor">Doctor</Option>
            <Option value="Patient">Patient</Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "center", marginBottom: "10px", color: "bisque" }}>
          <h6>Already a user?</h6>
          <Link
            to="/login"
            className="ms-2 text-decoration-none"
            style={{ color: "pink" }}
          >
            Login
          </Link>
        </div>

        <Button
          htmlType="submit"
          className="register-button"
          style={{
            width: "100%",
            background: "pink",
            borderColor: "transparent",
            color: "black",
          }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
