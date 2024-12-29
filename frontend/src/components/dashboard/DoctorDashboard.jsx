import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Input, Table, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showTodayOnly, setShowTodayOnly] = useState(false); // Toggle for today's appointments
  const { user } = useSelector((state) => state.user);

  const userID = user.ID; // Doctor's user ID

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(
        "https://cams-b7fw.onrender.com/api/v1/appointment/getDoctorAppointment",
        { userID }
      );
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.");
    }
  };

  // Define today's date
  const today = new Date().toISOString().split("T")[0];

  // Filter, sort, and group appointments
  const statusOrder = ["Pending", "Confirmed", "Completed", "Cancelled"];
  const groupedAppointments = statusOrder.map((status) => ({
    status,
    appointments: appointments
      .filter((appointment) => appointment.status === status)
      .filter((appointment) => {
        const isToday = showTodayOnly
          ? new Date(appointment.date).toISOString().split("T")[0] === today
          : true;

        const patientName = appointment.patientId?.name?.toLowerCase() || "";
        return (
          isToday &&
          patientName.includes(searchText.toLowerCase())
        );
      })
      // Sort appointments by time in ascending order
      .sort((a, b) => {
        const timeA = new Date(`${a.date} ${a.time}`);
        const timeB = new Date(`${b.date} ${b.time}`);
        return timeA - timeB; // Earliest time first
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div>
      <h3>{showTodayOnly ? "Today's Appointments" : "All Appointments"}</h3>
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
          placeholder="Search by patient name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: "300px" }}
        />
        <Button
          style={{ background: "#4CAF50", color: "white" }}
          onClick={() => setShowTodayOnly(!showTodayOnly)}
        >
          {showTodayOnly ? "Show All Appointments" : "Show Today's Appointments"}
        </Button>
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
    </div>
  );
};

export default DoctorDashboard;
