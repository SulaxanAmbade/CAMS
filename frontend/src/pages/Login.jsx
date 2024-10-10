import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/register.css"; // Import the CSS file
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle the form submission (login)
  const onSubmithandle = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());

      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Store JWT token
        const userData = response.data.user;
        console.log(userData); // Assuming user data is returned in the response

        // Check if the user's profile is complete
        if (!userData.profileCompleted) {
          message.warning("Please complete your profile.");
          navigate("/comProfile"); // Redirect to profile completion page
        } else {
          message.success(response.data.message);
          navigate("/"); // Redirect to a dashboard or home page
        }
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="formContainer">
      <Form layout="vertical" onFinish={onSubmithandle} className="registerForm">
        <h3 style={{ textAlign: "center", color: "bisque" }}>Login</h3>

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
          <Input placeholder="+91 XXXXXXXXXX" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <div
          style={{ textAlign: "center", marginBottom: "10px", color: "bisque" }}
        >
          <h6>Not Registered?</h6>
          <Link
            to="/register"
            className="ms-2 text-decoration-none"
            style={{ color: "pink" }}
          >
            Register
          </Link>
        </div>

        <Button
          htmlType="submit"
          className="login-button"
          style={{
            width: "100%",
            background: "pink",
            borderColor: "transparent",
            color: "black",
          }}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
