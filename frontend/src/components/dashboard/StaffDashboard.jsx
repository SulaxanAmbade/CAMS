import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  notification,
  Input,
  Button,
  Select,
  Spin,
  Card,
  Radio,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Modal,
  Tag
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import "../../css/dashboard.css";
import Spinner from "../requirements/Spinner";

const { Option } = Select;

/* =======================
   Embedded AppointmentForm
   ======================= */
const AppointmentForm = ({
  patients,
  doctors,
  fetchAppointments,
  setShowModal,
}) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScheduleAppointment = async () => {
    if (selectedPatient && selectedDoctor && selectedDate && selectedTime) {
      setLoading(true);
      const doctor = doctors.find((doc) => doc._id === selectedDoctor);

      if (doctor) {
        const { visitingHours } = doctor;
        const startHour = visitingHours.start;
        const endHour = visitingHours.end;
        const selectedHour = selectedTime.format("HH:mm");

        if (selectedHour < startHour || selectedHour > endHour) {
          notification.error({
            message: "Invalid Time Slot",
            description: `Selected time is outside the doctor's visiting hours. Please select a time between ${startHour} and ${endHour}.`,
          });
          setLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(
          "https://cams-qgq9.onrender.com/api/v1/appointment/createAppointment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: selectedPatient,
              doctorId: selectedDoctor,
              date: selectedDate.format("YYYY-MM-DD"),
              time: selectedTime.format("HH:mm"),
              remark: remark,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to schedule appointment");
        }

        const result = await response.json();

        if (result.success) {
          notification.success({
            message: "Appointment scheduled successfully",
          });
          setSelectedPatient("");
          setSelectedDoctor("");
          setSelectedDate("");
          setSelectedTime(null);
          setRemark("");
          fetchAppointments(); // refresh appointment list
          setShowModal(false); // close form
        } else {
          notification.error({
            message: "Failed to schedule appointment. Please try again.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to schedule appointment. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      notification.warning({
        message: "Details not filled!",
        description: "Please select patient, doctor, date, and time.",
      });
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#f4f4f4",
        borderRadius: 10,
      }}
    >
      <h2>Schedule Appointment</h2>
      <p>Patient</p>
      <Select
        placeholder="Select Patient"
        value={selectedPatient}
        onChange={setSelectedPatient}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        {patients.map((patient) => (
          <Option key={patient._id} value={patient._id}>
            {patient.name}
          </Option>
        ))}
      </Select>
      <p>Doctor</p>
      <Select
        placeholder="Select Doctor"
        value={selectedDoctor}
        onChange={(value) => {
          setSelectedDoctor(value);
          setSelectedDate(null);
          setSelectedTime(null);
        }}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        {doctors.map((doctor) => (
          <Option key={doctor._id} value={doctor._id}>
            {doctor.name}
          </Option>
        ))}
      </Select>

      <DatePicker
        placeholder="Select Date"
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
        }}
        disabled={!selectedDoctor}
        style={{ width: "100%", marginBottom: "1rem" }}
        disabledDate={(current) => current && current < moment().startOf("day")}
      />

      <TimePicker
        placeholder="Select Time"
        value={selectedTime}
        onChange={setSelectedTime}
        disabled={!selectedDoctor || !selectedDate}
        format="HH:mm"
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <TextArea
        rows={4}
        placeholder="Enter any remarks (optional)"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Button
        type="primary"
        onClick={handleScheduleAppointment}
        loading={loading}
      >
        Schedule Appointment
      </Button>

      <Button
        style={{ marginLeft: "1rem" }}
        danger
        onClick={() => setShowModal(false)}
      >
        Cancel
      </Button>
    </div>
  );
};

/* =====================
   Main StaffDashboard
   ===================== */
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
      const res = await axios.get(
        "https://cams-qgq9.onrender.com/api/v1/appointment/getAllAppointments"
      );
      setAppointments(res.data.data);
    } catch (err) {
      notification.error({ message: "Failed to fetch appointments." });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        "https://cams-qgq9.onrender.com/api/v1/patient/getAllPatient"
      );
      setPatients(res.data.data);
    } catch {
      notification.error({ message: "Failed to fetch patients." });
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "https://cams-qgq9.onrender.com/api/v1/doctor/getAllDoctors"
      );
      setDoctors(res.data.data);
    } catch {
      notification.error({ message: "Failed to fetch doctors." });
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `https://cams-qgq9.onrender.com/api/v1/appointment/updateStatus/${appointmentId}`,
        {
          status: newStatus,
        }
      );
      notification.success({
        message: `Status updated `,
        description: `Status updated to ${newStatus}.`,
      });
      fetchAppointments();
    } catch {
      notification.error({ message: "Failed to update status" });
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
        return "#ffff00";
      case "Pending":
        return "#ab0a0a";
      case "Cancelled":
        return "#6a6a6a";
      case "Completed":
        return "#008100";
      default:
        return "#ffffff";
    }
  };
  const isTomorrowConfirmed = (appointment) => {
    const tomorrow = moment().add(1, "day");
    return (
      appointment.status === "Confirmed" &&
      moment(appointment.date).isSame(tomorrow, "day")
    );
  };
  return (
    <div>
      <h3 className="dashboard-header">
        {showTodayOnly ? "Today's Appointments" : "All Appointments"}
      </h3>

      <div className="dashboard-controls">
        <Input
          placeholder="Search by Patient or Doctor name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Radio.Group
          className="radio-group"
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
          className="today-button"
          onClick={() => setShowTodayOnly(!showTodayOnly)}
        >
          {showTodayOnly
            ? "Show All Appointments"
            : "Show Today's Appointments"}
        </Button>

        <Button className="add-button" onClick={() => setShowModal(true)}>
          Add Appointment
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredAppointments.map((a) => (
            <Col xs={24} sm={12} md={8} lg={6} key={a._id}>
              <Card
                hoverable
                className="card-style"
                style={{
                  background: `linear-gradient(135deg,#f5f0eb,${getCardColor(
                    a.status
                  )})`,
                  border: isTomorrowConfirmed(a) ? "2px solid #ff0000" : "none",
                }}
              >
                {isTomorrowConfirmed(a) ? (
                  <Tag color="red" style={{ marginBottom: 8 }}>
                    Tomorrow's Confirmed Appointment
                  </Tag>
                ) : (
                  <Select
                    value={a.status}
                    onChange={(value) => handleStatusChange(a._id, value)}
                  >
                    {statusOrder.map((s) => (
                      <Option key={s} value={s}>
                        {s}
                      </Option>
                    ))}
                  </Select>
                )}

                <div className="appointment-date">
                  {moment(a.date).format("DD MMMM")}{" "}
                  {moment(a.date).format("YYYY")}
                </div>

                <div className="appointment-time">{a.time}</div>

                <div className="appointment-info">
                  {a.patientId?.name || "Deleted Patient"} <br />
                  Dr.{a.doctorId?.name || "Deleted Doctor"}
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
        centered
        destroyOnClose
      >
        <AppointmentForm
          patients={patients}
          doctors={doctors}
          fetchAppointments={fetchAppointments}
          setShowModal={setShowModal}
        />
      </Modal>
    </div>
  );
};

export default StaffDashboard;
