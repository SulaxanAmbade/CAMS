import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  notification as message,
  Spin,
  Input,
  Select,
  Timeline,
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

  // Define the order for grouping statuses
  const statusOrder = [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "No-Show",
  ];

  // Group appointments by status
  const groupedAppointments = statusOrder.map((status) => ({
    status,
    appointments: appointments
      .filter((appointment) => appointment.status === status)
      .filter((appointment) => {
        const patientName = appointment.patientId?.name?.toLowerCase() || "";
        const doctorName = appointment.doctorId?.name?.toLowerCase() || "";
        return (
          patientName.includes(searchText.toLowerCase()) ||
          doctorName.includes(searchText.toLowerCase())
        );
      })
      // Sort appointments by date and time in descending order
      .sort((a, b) => {
        // Parse dates
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Compare dates first
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB; // Ascending order by date
        }

        // If dates are the same, compare times
        const timeA = moment(a.time, "HH:mm");
        const timeB = moment(b.time, "HH:mm");

        return timeA - timeB; // Ascending order by time
      }),
  }));

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
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Confirmed">Confirmed</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
          <Select.Option value="No-Show">No-Show</Select.Option>
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
          placeholder="Search by patient name or doctor name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginBottom: 16,
            width: "300px",
            background: "#b7202eaa",
            color: "white",
          }}
        />
        <Button
          style={{ background: "#b7202eee", color: "white" }}
          onClick={handleAppointmentButton}
        >
          Add Appointment
        </Button>
      </div>

      {loadingAppointments ? (
        <Spin size="large" />
      ) : (
        groupedAppointments.map((group) => (
          <div key={group.status} style={{ marginBottom: "40px" }}>
            <h4>{group.status} Appointments</h4>
            <Table
              dataSource={group.appointments}
              columns={appointmentColumns}
              pagination={false}
              rowKey={(record) => record._id}
            />
          </div>
        ))
      )}

      <Modal open={APPform} footer={null} onCancel={handleAppFormClose}>
        <AppointmentForm />
      </Modal>
    </>
  );
};

export default StaffDashboard;
