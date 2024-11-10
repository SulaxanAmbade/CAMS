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
  ];

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
