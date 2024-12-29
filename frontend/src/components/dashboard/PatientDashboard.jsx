import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { Input, Table } from "antd";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const userID = user.ID;

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(
        "https://cams-b7fw.onrender.com/api/v1/appointment/getPatientAppointment",
        { userID }
      );
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.", error);
    }
  };

  // Filter, sort, and group appointments by status
  const statusOrder = ["Pending", "Confirmed", "Completed", "Cancelled"];
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
      // Sort appointments by recent date and time
      .sort((a, b) => {
        const dateA = new Date(a.date + " " + a.time);
        const dateB = new Date(b.date + " " + b.time);
        return dateB - dateA; // Sort in descending order (most recent first)
      }),
  }));

  const appointmentColumns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctor) => (doctor ? doctor.name : "Deleted Patient"),
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
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
          placeholder="Search by patient name or doctor name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: "300px" }}
        />
      </div>

      {groupedAppointments.map((group) => (
        <div key={group.status} style={{ marginBottom: "40px" }}>
          <h4>{group.status} Appointments</h4>
          <Table
            dataSource={group.appointments}
            columns={appointmentColumns}
            pagination={false}
            rowKey={(record) => record._id}
          />
        </div>
      ))}
    </>
  );
};

export default PatientDashboard;
