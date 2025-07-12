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
  Tag,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import "../../css/dashboard.css";
import Spinner from "../requirements/Spinner";
const { Option } = Select;
const { TextArea } = Input;

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const userID = user._id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [remark, setRemark] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/getAllPatient`
      );
      setPatients(res.data.data);
    } catch {
      message.error("Failed to fetch patients.");
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/getDoctorAppointment`,
        {
          userID,
        }
      );
      setAppointments(res.data.data);
    } catch {
      message.error("Error fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/updateStatus/${appointmentId}`,
        {
          status: newStatus,
        }
      );
      message.success("Status updated");
      setShowDetailsModal(false);
      fetchAppointments();
    } catch {
      message.error("Failed to update status");
    }
  };

  const openAddModal = () => {
    setSelectedPatient("");
    setSelectedDate(null);
    setSelectedTime(null);
    setRemark("");
    setSelectedStatus("Confirmed");
    setShowModal(true);
  };

  const handleAddSubmit = async () => {
    if (!selectedPatient || !selectedDate || !selectedTime) {
      message.info("Please fill all required fields.");
      return;
    }

    setModalLoading(true);

    const visitingHours = user.visitingHours;
    if (visitingHours) {
      const startHour = visitingHours.start;
      const endHour = visitingHours.end;

      const selectedHour = selectedTime.format("HH:mm");
      const selectedDateTime = moment(
        `${selectedDate.format("YYYY-MM-DD")} ${selectedHour}`,
        "YYYY-MM-DD HH:mm"
      );

      const currentDateTime = moment();

      if (selectedDateTime.isBefore(currentDateTime)) {
        message.error(
          `Selected time (${selectedDateTime.format(
            "HH:mm"
          )}) is in the past. Please choose a future time.`
        );
        setModalLoading(false);
        return;
      }

      if (selectedHour < startHour || selectedHour > endHour) {
        message.error(
          `Selected time is outside your visiting hours. Please select a time between ${startHour} and ${endHour}.`
        );
        setModalLoading(false);
        return;
      }
    }

    const payload = {
      patientId: selectedPatient,
      doctorId: userID,
      date: selectedDate.format("YYYY-MM-DD"),
      time: selectedTime.format("HH:mm"),
      status: "Confirmed",
      remarks: remark,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/createAppointment`,
        payload
      );
      message.success("Appointment created successfully");
      setShowModal(false);
      fetchAppointments();
    } catch {
      message.error("Failed to create appointment.");
    } finally {
      setModalLoading(false);
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
      return isToday && patientName.includes(searchText.toLowerCase());
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
          placeholder="Search by Patient's Name"
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
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {showTodayOnly
            ? "Show All Appointments"
            : "Show Today's Appointments"}
        </Button>
        <Button className="add-button" type="primary" onClick={openAddModal}>
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
                  background: `linear-gradient(135deg,#e3e1e1,${getCardColor(
                    a.status
                  )})`,
                  border: isTomorrowConfirmed(a) ? "2px solid #ff0000" : "none",
                }}
                onClick={() => {
                  setSelectedAppointment(a);
                  setShowDetailsModal(true);
                }}
              >
                {isTomorrowConfirmed(a) ? (
                  <Tag color="red" style={{ marginBottom: 8 }}>
                    Tomorrow's Confirmed Appointment
                  </Tag>
                ) : (
                  <div>{a.status}</div>
                )}{" "}
                <div style={{ fontSize: "200%" }}>
                  {moment(a.date).format("DD MMMM")}
                </div>
                <div>{moment(a.date).format("YYYY")}</div>
                <div style={{ fontSize: "200%" }}>{a.time}</div>
                <div>{a.patientId?.name || "Deleted Patient"}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Add Appointment"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleAddSubmit}
        confirmLoading={modalLoading}
        okText="Create"
        centered
      >
        Patient:
        <Select
          value={selectedPatient}
          placeholder="Select Patient"
          onChange={setSelectedPatient}
          style={{ width: "100%", marginBottom: 16 }}
        >
          {patients.map((patient) => (
            <Option key={patient._id} value={patient._id}>
              {patient.name}
            </Option>
          ))}
        </Select>
        Date:
        <DatePicker
          style={{ width: "100%", marginBottom: 16 }}
          value={selectedDate}
          onChange={setSelectedDate}
          disabledDate={(current) =>
            current && current < moment().startOf("day")
          }
          placeholder="Select Date"
        />
        Time:
        <TimePicker
          style={{ width: "100%", marginBottom: 16 }}
          value={selectedTime}
          onChange={setSelectedTime}
          format="HH:mm"
          placeholder="Select Time"
        />
        Status:Confirmed
        <TextArea
          rows={4}
          placeholder="Enter any remarks (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          style={{ marginBottom: 16 }}
        />
      </Modal>

      <Modal
        title="Appointment Details"
        open={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        footer={null}
        centered
      >
        <Card
          style={{
            background: `radial-gradient(circle,${getCardColor(
              selectedAppointment?.status
            )}99,#ffffff`,
          }}
        >
          <p>
            <b>Patient Name:</b>{" "}
            {selectedAppointment?.patientId?.name || "Unknown"}
          </p>
          <p>
            <b>Date:</b>{" "}
            {moment(selectedAppointment?.date).format("DD/MM/YYYY")}
          </p>
          <p>
            <b>Time:</b> {selectedAppointment?.time}
          </p>

          <p>
            <b>Remarks:</b> {selectedAppointment?.remarks || "No Remarks"}
          </p>
          <p>
            Status:
            <Select
              value={selectedAppointment?.status}
              onChange={(value) =>
                handleStatusChange(selectedAppointment?._id, value)
              }
            >
              {statusOrder.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </p>
        </Card>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
