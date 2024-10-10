import React from "react";
import { Form, Input, Button } from "antd";

const StaffProfileForm = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <h3>Complete Your Profile (Staff)</h3>

      <Form.Item
        label="Position"
        name="position"
        rules={[{ required: true, message: "Please enter your position!" }]}
      >
        <Input placeholder="Position (e.g., Receptionist, Nurse)" />
      </Form.Item>

      <Form.Item
        label="Department"
        name="department"
        rules={[{ required: true, message: "Please enter your department!" }]}
      >
        <Input placeholder="Department (e.g., Pediatrics, Surgery)" />
      </Form.Item>

      <Form.Item
        label="Shift Timings"
        name="shift"
        rules={[{ required: true, message: "Please enter your shift timings!" }]}
      >
        <Input placeholder="Shift timings (e.g., 8 AM - 4 PM)" />
      </Form.Item>

      <Form.Item
        label="Supervisor"
        name="supervisor"
        rules={[{ required: true, message: "Please enter your supervisor's name!" }]}
      >
        <Input placeholder="Supervisor's Name" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default StaffProfileForm;
