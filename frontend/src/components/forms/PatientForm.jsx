import React from "react";
import { Form, Input, DatePicker, Button } from "antd";

const PatientProfileForm = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <h3>Complete Your Profile (Patient)</h3>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true, message: "Please select your date of birth!" }]}
      >
        <DatePicker placeholder="Select your date of birth" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Contact Number"
        name="contactNo"
        rules={[{ required: true, message: "Please enter your contact number!" }]}
      >
        <Input placeholder="+91 XXXXXXXXXX" />
      </Form.Item>

      <Form.Item
        label="Emergency Contact"
        name="emergencyContact"
        rules={[{ required: true, message: "Please enter your emergency contact!" }]}
      >
        <Input placeholder="Emergency contact number" />
      </Form.Item>

      <Form.Item
        label="Medical History"
        name="medicalHistory"
      >
        <Input.TextArea placeholder="Enter your medical history (if any)" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default PatientProfileForm;
