import React from "react";
import { Button, Form, Input, Select, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/register.css"; // Ensure your CSS file is linked

const Register = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();  // For form handling

  const onSubmithandle = async (values) => {
    try {
      // Send POST request to backend
      const response = await axios.post("/api/register", values);
      
      // Show success message
      message.success(`${values.role} registered successfully!`);
      
      // Navigate to homepage with user details
      navigate("/home", { state: { user: response.data.user } });
    } catch (error) {
      // Show error message
      message.error("Registration failed, please try again.");

      // Reset form fields
      form.resetFields();
    }
  };

  return (
    <div className="formContainer">
      <Form
        form={form}  // Bind form instance to the Form component
        layout="vertical"
        onFinish={onSubmithandle}
        className="registerForm"
      >
        <h3 style={{ textAlign: "center", color: "bisque" }}>Register</h3>

        <Form.Item
          label="Phone Number"
          name="phNo"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: /^\+91\s\d{10}$/, message: "Invalid phone number format!" }
          ]}
        >
          <Input placeholder="+91 XXXXXXXXXX" />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="fName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="pass"
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
          <Link to="/login" className="ms-2 text-decoration-none" style={{ color: "pink" }}>
            Login
          </Link>
        </div>

        <Button
          htmlType="submit"
          className="register-button"
          style={{ width: "100%", background: "pink", borderColor: "transparent", color: "black" }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
