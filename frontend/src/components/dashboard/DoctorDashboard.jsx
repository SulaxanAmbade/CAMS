import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { Input, Table } from "antd";
const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    
    try {
      const response = await axios.get(
        "/api/v1/appointment/getAllAppointments"
      );
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.");
    } finally {
     
    }
  };
  const filteredAppointments = appointments.filter((appointment) => {
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
      </div>

      <Table
        dataSource={filteredAppointments}
        columns={appointmentColumns}
        pagination={false}
      />
    </>
  );
};

export default DoctorDashboard;
