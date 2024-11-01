import { Table, Form, Input, Button, Modal, notification as message } from "antd";
import React, { useEffect, useState } from "react";

export const DoctorManagement = () => {
  const [doctorData, setDoctorData] = useState([]);
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [doctorForm] = Form.useForm();

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/v1/doctor/getAllDoctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctorData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAddDoctor = async (values) => {
    try {
      const response = await fetch("/api/v1/doctor/addNewDoctor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error("Failed to add doctor");
      const newDoctor = await response.json();
      setDoctorData([...doctorData, newDoctor.data]);
      setIsDoctorModalVisible(false);
      doctorForm.resetFields();
      message.success({ message: "Doctor added successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialty", dataIndex: "specialty", key: "specialty" },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsDoctorModalVisible(true)}>Add New Doctor</Button>
      <Table dataSource={doctorData} columns={columns} pagination={false} />
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
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Please input the doctor's specialty!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact No"
            name="contactNo"
            rules={[{ required: true, message: "Please input the doctor's contact number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the doctor's email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DoctorManagement;
