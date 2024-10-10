import React from "react";
import { Form, Input, Button, Select } from "antd";

const DoctorProfileForm = ({ onSubmit }) => {
  const { Option } = Select;

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <h3>Complete Your Profile (Doctor)</h3>
      
      <Form.Item
        label="Specialty"
        name="specialty"
        rules={[{ required: true, message: "Please select your specialty!" }]}
      >
        <Select placeholder="Select your specialty">
          <Option value="Cardiologist">Cardiologist</Option>
          <Option value="Dermatologist">Dermatologist</Option>
          <Option value="Neurologist">Neurologist</Option>
          <Option value="Pediatrician">Pediatrician</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Years of Experience"
        name="experience"
        rules={[{ required: true, message: "Please enter your experience!" }]}
      >
        <Input placeholder="Years of experience" />
      </Form.Item>

      <Form.Item
        label="Consultation Fee"
        name="fee"
        rules={[{ required: true, message: "Please enter your consultation fee!" }]}
      >
        <Input placeholder="Consultation fee" type="number" />
      </Form.Item>

      <Form.Item
        label="Available Timings"
        name="timings"
        rules={[{ required: true, message: "Please enter your available timings!" }]}
      >
        <Input placeholder="Available timings (e.g., 9 AM - 5 PM)" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default DoctorProfileForm;
