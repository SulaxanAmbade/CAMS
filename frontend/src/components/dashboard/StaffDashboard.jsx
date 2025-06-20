import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  message,
  Input,
  Button,
  Select,
  Spin,
  Modal,
  DatePicker,
  TimePicker,
  Card,
  Radio,
  Row,
  Col,
} from "antd";
import moment from "moment";
import AppointmentForm from "../functions/AppointmentForm";
const { Option } = Select;

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://cams-qgq9.onrender.com/api/v1/appointment/getAllAppointments");
      setAppointments(res.data.data);
    } catch (err) {
      message.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://cams-qgq9.onrender.com/api/v1/patient/getAllPatient");
      setPatients(res.data.data);
    } catch {
      message.error("Failed to fetch patients.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("https://cams-qgq9.onrender.com/api/v1/doctor/getAllDoctors");
      setDoctors(res.data.data);
    } catch {
      message.error("Failed to fetch doctors.");
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`https://cams-qgq9.onrender.com/api/v1/appointment/updateStatus/${appointmentId}`, {
        status: newStatus,
      });
      message.success("Status updated");
      fetchAppointments();
    } catch {
      message.error("Failed to update status");
    }
  };

  const today = moment().format("YYYY-MM-DD");
  const statusOrder = ["Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredAppointments = appointments
    .filter((a) => (filterStatus !== "All" ? a.status === filterStatus : true))
    .filter((a) => {
      const isToday = showTodayOnly
        ? moment(a.date).format("YYYY-MM-DD") === today
        : true;
      const patientName = a.patientId?.name?.toLowerCase() || "";
      const doctorName = a.doctorId?.name?.toLowerCase() || "";
      return (
        isToday &&
        (patientName.includes(searchText.toLowerCase()) ||
          doctorName.includes(searchText.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const timeA = moment(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm");
      const timeB = moment(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm");
      return timeA - timeB;
    });

  const getCardColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "#ffff00"; // yellow
      case "Pending":
        return "#ab0a0a"; // red
      case "Cancelled":
        return "#6a6a6a"; // grey
      case "Completed":
        return "#008100"; // green
      default:
        return "#ffffff";
    }
  };

  return (
    <div>
      <h3>{showTodayOnly ? "Today's Appointments" : "All Appointments"}</h3>

      <div
        style={{
          position: "sticky",
          top: "20px",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Search by patient or doctor name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 8 }}
        />

        <Radio.Group
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <Radio.Button value="All">All</Radio.Button>
          {statusOrder.map((status) => (
            <Radio.Button key={status} value={status}>
              {status}
            </Radio.Button>
          ))}
        </Radio.Group>

        <Button
          onClick={() => setShowTodayOnly(!showTodayOnly)}
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {showTodayOnly
            ? "Show All Appointments"
            : "Show Today's Appointments"}
        </Button>

        <Button onClick={() => setShowModal(true)}>Add Appointment</Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredAppointments.map((a) => (
            <Col xs={24} sm={12} md={8} lg={6} key={a._id}>
              <Card
                hoverable
                style={{
                  background: `linear-gradient(135deg,#e3e1e1,${getCardColor(
                    a.status
                  )})`,
                  display: "flex",
                  placeContent: "center",
                  textAlign: "center",
                }}
              >
                <Select
                  value={a.status}
                  onChange={(value) => handleStatusChange(a._id, value)}
                  style={{ width: "100%" }}
                >
                  {statusOrder.map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
                <div style={{ fontSize: "150%" }}>
                  {moment(a.date).format("DD MMMM")}{" "}
                  {moment(a.date).format("YYYY")}
                </div>
                <div style={{ fontSize: "150%" }}>{a.time}</div>
                <div style={{ fontSize: "200%" }}>
                  {a.patientId?.name || "Deleted Patient"}{" "}
                  {a.doctorId?.name || "Deleted Doctor"}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <AppointmentForm />
      </Modal>
    </div>
  );
};

export default StaffDashboard;
