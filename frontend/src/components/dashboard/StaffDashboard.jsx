import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  notification as message,
  DatePicker,
  Spin,
  Alert,
  Select,
  Input,
} from "antd";
import axios from "axios";
import moment from "moment"; // Import moment for date handling
import AppointmentForm from "../functions/AppointmentForm";

export const StaffDashboard = () => {
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [searchText, setSearchText] = useState(""); // Search text state
  const [APPform, setAPPform] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/api/v1/patient/getAllPatient");
      setPatientData(response.data.data);
    } catch (error) {
      message.error("Failed to fetch patients.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/v1/doctor/getAllDoctors");
      setDoctorData(response.data.data);
    } catch (error) {
      message.error("Failed to fetch doctors.");
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await axios.get(
        "/api/v1/appointment/getAllAppointments"
      );
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleAppointmentButton = () => setAPPform(true);
  const handleAppFormClose = () => setAPPform(false);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/v1/appointment/updateStatus/${appointmentId}`, {
        status: newStatus,
      });
      message.success({ message: "Status updated successfully" });
      fetchAppointments(); // Refresh appointments after status update
    } catch (error) {
      message.error({ message: "Error updating status." });
    }
  };

  // Filter and sort appointments by status order and search text
  const filteredAppointments = appointments
    .filter((appointment) => {
      const patientName = appointment.patientId?.name?.toLowerCase() || "";
      const doctorName = appointment.doctorId?.name?.toLowerCase() || "";
      const status = appointment.status.toLowerCase();
      return (
        patientName.includes(searchText.toLowerCase()) ||
        doctorName.includes(searchText.toLowerCase()) ||
        status.includes(searchText.toLowerCase())
      );
    })
    .sort((a, b) => {
      const statusOrder = {
        Pending: 1,
        Confirmed: 2,
        Completed: 3,
        Cancelled: 4,
      };
      return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
    });

  const appointmentColumns = [
    {
      title: "Patient Name",
      dataIndex: "patientId",
      key: "patientId",
      render: (patient) => (patient ? patient.name : "Deleted Patient"),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctor) => (doctor ? doctor.name : "Deleted Doctor"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Update Status",
      key: "update",
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: 120 }}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Completed">Completed</Option>
          <Option value="No-Show">No-Show</Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <h3>All Appointments</h3>
      <div
        style={{
          position: "sticky",
          top: "20px",
          zIndex: "2",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search by patient name, doctor name, or status"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: "300px" }}
        />
        <Button onClick={handleAppointmentButton}>Add Appointment</Button>
      </div>

      {loadingAppointments ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredAppointments}
          columns={appointmentColumns}
          pagination={false}
        />
      )}

      <Modal open={APPform} footer={null} onCancel={handleAppFormClose}>
        <AppointmentForm />
      </Modal>
    </>
  );
};

export default StaffDashboard;
