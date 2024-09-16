import React from 'react';
import { Button, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";
import '../css/register.css'; // Import the CSS file

const Login = () => {
  const { Option } = Select;

  const onSubmithandle = (values) => {
    console.log(values);
  }

  return (
    <div className="formContainer">
      <Form
        layout="vertical"
        onFinish={onSubmithandle}
        className="registerForm"
      >
        <h3 style={{ textAlign: 'center', color: 'bisque' }}>Login</h3>
        
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

        <div style={{ textAlign: 'center', marginBottom: '10px', color: 'bisque' }}>
          <h6>Not Registered?</h6>
          <Link to="/register" className="ms-2 text-decoration-none" style={{ color: 'pink' }}>
            Register
          </Link>
        </div>

        <Button 
          htmlType="submit" 
          className="login-button"
          style={{ width: '100%', background: 'pink', borderColor: 'transparent', color: 'black' }}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
