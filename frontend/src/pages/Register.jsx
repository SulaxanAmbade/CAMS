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

  const handleAddDoctor = async (values) => {
    try {
      const response = await axios.post("/api/v1/doctor/addNewDoctor", values);
      if (response.data.success) {
        message.success("Doctor added successfully!");
        setIsDoctorModalVisible(false);
        doctorForm.resetFields();
      } else {
        message.error(response.data.message || "Failed to add doctor");
      }
    } catch (error) {
      message.error("Error adding doctor");
    }
  };

  return (
    <div className="formContainer">
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
            rules={[
              { required: true, message: "Please input the doctor's name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the doctor's password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              { required: true, message: "Please input the specialization!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contactNo"
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
