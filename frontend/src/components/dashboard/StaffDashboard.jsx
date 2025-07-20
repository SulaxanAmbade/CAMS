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
  Tag,
  Dropdown,
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import "../../css/dashboard.css";
import Spinner from "../requirements/Spinner";
import {
  TableOutlined,
  CreditCardOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/api/v1/appointment/createAppointment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: selectedPatient,
              doctorId: selectedDoctor,
              date: selectedDate.format("YYYY-MM-DD"),
              slotTime: selectedTime,
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
          setSelectedTime("");
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
        borderRadius: 10,
      }}
    >
      <h2>Schedule Appointment</h2>
      <p>Patient</p>
      <Select
        placeholder="Select Patient"
        value={selectedPatient || "Select Patient"}
        onChange={setSelectedPatient}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        {patients?.map((patient) => (
          <Option key={patient._id} value={patient._id}>
            {patient.name}
          </Option>
        ))}
      </Select>
      <p>Doctor</p>
      <Select
        placeholder="Select Doctor"
        value={selectedDoctor || "Select Doctor"}
        onChange={(value) => {
          setSelectedDoctor(value);
          setSelectedDate(null);
          setSelectedTime(null);
        }}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        {doctors?.map((doctor) => (
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

      <Select
        placeholder="Select Time Slot"
        value={selectedTime}
        onChange={setSelectedTime}
        style={{ width: "100%", marginBottom: 16 }}
      >
        {[
          "09:00 – 10:00",
          "10:00 – 11:00",
          "11:00 – 12:00",
          "12:00 – 13:00",
          "14:00 – 15:00",
          "15:00 – 16:00",
          "16:00 – 17:00",
        ].map((slot) => (
          <Option key={slot} value={slot}>
            {slot}
          </Option>
        ))}
      </Select>

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
  const [dateRange, setDateRange] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // or "table"
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/getAllAppointments`
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
        `${process.env.REACT_APP_BACKEND}/api/v1/patient/getAllPatient`
      );
      setPatients(res.data.data);
    } catch {
      notification.error({ message: "Failed to fetch patients." });
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/v1/doctor/getAllDoctors`
      );
      setDoctors(res.data.data);
    } catch {
      notification.error({ message: "Failed to fetch doctors." });
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
      notification.success({
        message: `Status updated `,
        description: `Status updated to ${newStatus}.`,
      });
      fetchAppointments();
    } catch {
      notification.error({ message: "Failed to update status" });
    }
  };
  const confirmDelete = (appointmentId) => {
    Modal.confirm({
      centered: true,
      title: "Are you sure you want to delete this Appointment?",
      content: "This action cannot be undone.",
      onOk() {
        handleDelete(appointmentId);
      },
    });
  };
  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/deleteAppointment/${appointmentId}`
      );

      notification.success({ message: "Appointment deleted successfully!" });
      fetchAppointments();
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || error.message,
      });
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
      const inDateRange = dateRange
        ? moment(a.date).format("YYYY-MM-DD") >=
            dateRange[0].format("YYYY-MM-DD") &&
          moment(a.date).format("YYYY-MM-DD") <=
            dateRange[1].format("YYYY-MM-DD")
        : true;

      const patientName = a.patientId?.name?.toLowerCase() || "";
      return (
        isToday && inDateRange && patientName.includes(searchText.toLowerCase())
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
          placeholder="Search by Patient's Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DatePicker.RangePicker
          onChange={(dates) => setDateRange(dates)}
          allowClear
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
          {showTodayOnly ? "All" : "Today's"}
        </Button>

        <Button className="add-button" onClick={() => setShowModal(true)}>
          Add Appointment
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
          Showing {filteredAppointments.length} Appointments
        </p>
        <Button
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          className="add-button"
        >
          {viewMode === "card" ? (
            <>
              <TableOutlined style={{ marginRight: "2px" }} />
              Table
            </>
          ) : (
            <>
              <CreditCardOutlined style={{ marginRight: "2px" }} />
              Card
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : viewMode === "card" ? (
        <Row gutter={[16, 16]}>
          {filteredAppointments.map((a) => (
            <Col xs={24} sm={12} md={8} lg={6} key={a._id}>
              <Card
                hoverable
                className="card-style"
                style={{
                  background: `linear-gradient(0deg,#000000,${getCardColor(
                    a.status
                  )})`,
                  border: isTomorrowConfirmed(a) ? "2px solid #ff0000" : "none",
                }}
              >
                {isTomorrowConfirmed(a) && (
                  <>
                    <Tag
                      color="red"
                      style={{
                        textAlign: "center",
                        width: "100%",
                        marginBottom: 8,
                      }}
                    >
                      Tomorrow's Confirmed Appointment
                    </Tag>
                    <Button
                      type="primary"
                      size="small"
                      block
                      style={{ marginBottom: 8 }}
                      onClick={async () => {
                        try {
                          const res = await axios.post(
                            `${process.env.REACT_APP_BACKEND}/api/v1/notification/send-custom-reminder`,
                            {
                              appointmentId: a._id,
                              title: "⏰ Appointment Reminder",
                              message: `You have an appointment tomorrow at ${a.slotTime}`,
                            }
                          );

                          if (res.data.success) {
                            notification.success({
                              message: "Reminder sent successfully!",
                            });
                          } else {
                            notification.error({
                              message:
                                res.data.message || "Failed to send reminder.",
                            });
                          }
                        } catch {
                          notification.error({
                            message: "Error sending reminder.",
                          });
                        }
                      }}
                    >
                      Send Reminder
                    </Button>
                  </>
                )}
                <div style={{ display: "flex" }}>
                  <Select
                    value={a.status}
                    onChange={(value) => handleStatusChange(a._id, value)}
                    style={{ flexGrow: "2", width: "100%", marginBottom: 8 }}
                  >
                    {statusOrder.map((s) => (
                      <Select.Option key={s} value={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>

                  <Button
                    type="text"
                    danger
                    onClick={() => confirmDelete(a._id)}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>

                <div className="appointment-date">
                  {moment(a.date).format("DD MMMM YYYY")}
                </div>
                <div className="appointment-time">{a.slotTime}</div>
                <div className="appointment-info">
                  {a.patientId?.name || "Deleted Patient"}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <table
          style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Patient
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {moment(a.date).format("DD MMM YYYY")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {a.slotTime}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {a.patientId?.name || "Unknown"}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: `${getCardColor(a.status)}`,
                  }}
                >
                  <Select
                    size="small"
                    value={a.status}
                    onChange={(value) => handleStatusChange(a._id, value)}
                  >
                    {statusOrder.map((s) => (
                      <Select.Option key={s} value={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <Button
                    type="text"
                    danger
                    onClick={() => confirmDelete(a._id)}
                  >
                    <DeleteOutlined />
                  </Button>
                  {isTomorrowConfirmed(a) && (
                    <Button
                      type="link"
                      onClick={async () => {
                        try {
                          const res = await axios.post(
                            `${process.env.REACT_APP_BACKEND}/api/v1/notification/send-custom-reminder`,
                            {
                              appointmentId: a._id,
                              title: "⏰ Appointment Reminder",
                              message: `You have an appointment tomorrow at ${a.slotTime}`,
                            }
                          );

                          if (res.data.success) {
                            notification.success({
                              message: "Reminder sent successfully!",
                            });
                          } else {
                            notification.error({
                              message:
                                res.data.message || "Failed to send reminder.",
                            });
                          }
                        } catch {
                          notification.error({
                            message: "Error sending reminder.",
                          });
                        }
                      }}
                    >
                      Send Reminder
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
