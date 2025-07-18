import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Modal,
  TimePicker,
  InputNumber,
} from "antd";
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

  // Modal and doctor form state
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [doctorForm] = Form.useForm();
  const [visitingTimeStrings, setVisitingTimeStrings] = useState({
    start: "",
    end: "",
  });

  const onSubmithandle = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/staff/register", values);
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

  const handleAddDoctor = async (values) => {
    try {
      if (!visitingTimeStrings.start || !visitingTimeStrings.end) {
        message.error("Please select both start and end times!");
        return;
      }

      const doctorDataToSend = {
        name: values.name,
        password: values.password,
        specialization: values.specialization,
        contact: values.contact || "",
        visitingHours: {
          start: visitingTimeStrings.start,
          end: visitingTimeStrings.end,
          slot: values.slotsDuration,
        },
      };

      const response = await axios.post("/api/v1/doctor/addNewDoctor", doctorDataToSend);
      if (response.data.success) {
        message.success("Doctor added successfully!");
        setIsDoctorModalVisible(false);
        doctorForm.resetFields();
        setVisitingTimeStrings({ start: "", end: "" });
      } else {
        message.error(response.data.message || "Failed to add doctor");
      }
    } catch (error) {
      message.error("Error adding doctor");
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
            {
              pattern: /^\+91\d{10}$/,
              message: "Invalid phone number format!",
            },
          ]}
        >
          <Input placeholder="+91XXXXXXXXXX" />
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


        <div style={{ textAlign: "center", marginBottom: "10px", color: "bisque" }}>
          <h6>Already a user?</h6>
          <Link to="/login" className="ms-2 text-decoration-none" style={{ color: "pink" }}>
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

      {/* Add New Doctor Button */}
      <Button
        style={{ marginTop: "20px", background: "#b7202eee", color: "white" }}
        onClick={() => setIsDoctorModalVisible(true)}
      >
        Add New Doctor
      </Button>

      {/* Doctor Modal */}
      <Modal
        title="Add New Doctor"
        open={isDoctorModalVisible}
        onCancel={() => setIsDoctorModalVisible(false)}
        footer={null}
      >
        <Form form={doctorForm} onFinish={handleAddDoctor}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the doctor's name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the doctor's password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true, message: "Please input the specialization!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contact"
            rules={[
              { required: true, message: "Please input the contact number!" },
              {
                pattern: /^\+91\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Visiting Hours"
            name="visitingHours"
            rules={[{ required: true, message: "Please select visiting hours!" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              onChange={(time, timeString) => {
                setVisitingTimeStrings({
                  start: timeString[0],
                  end: timeString[1],
                });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Slot Duration (Minutes)"
            name="slotsDuration"
            rules={[{ required: true, message: "Enter slot duration in minutes!" }]}
          >
            <InputNumber min={5} max={180} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Register;
