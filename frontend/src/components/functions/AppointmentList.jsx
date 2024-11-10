import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, message } from "antd";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/appointment/getAllAppointments");
        setAppointments(response.data.data);
      } catch (error) {
        message.error("Error fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Define columns for the table
 const columns = [
  { title: "Patient Name", dataIndex: "patientId", key: "patientId", render: (patient) => patient.name },
  { title: "Doctor Name", dataIndex: "doctorId", key: "doctorId", render: (doctor) => doctor.name },
  { title: "Date", dataIndex: "date", key: "date", render: (date) => new Date(date).toLocaleDateString() },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Status", dataIndex: "status", key: "status" },
  {
    title: "Update Status",
    key: "update",
    render: (text, record) => (
      <Select
        defaultValue={record.status}
        onChange={(newStatus) => handleStatusChange(record.key, newStatus)}
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

// Function to handle status change
const handleStatusChange = async (appointmentId, newStatus) => {
  try {
    const response = await fetch(`/api/v1/appointment/updateStatus/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const result = await response.json();
    if (result.success) {
      message.success("Status updated successfully");
      // Refresh data here if necessary
    } else {
      message.error("Failed to update status");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    message.error("An error occurred while updating the status.");
  }
};


  return (
    <div>
      <h2>All Appointments</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={appointments}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AppointmentsList;
