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
  notification,
  Flex,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import "../../css/dashboard.css";
import { TableOutlined, CreditCardOutlined } from "@ant-design/icons";
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
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dateRange, setDateRange] = useState(null);

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
      notification.error({ message: "Failed to fetch patients." });
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
      notification.error({
        message: "Failed to fetch Appointments",
        description: "No Apointments",
      });
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
      setShowDetailsModal(false);
      fetchAppointments();
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || error.message,
      });
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
      notification.warning({
        message: "Incomplete Details",
        description: "Please fill all the Details",
      });
      return;
    }

    setModalLoading(true);

    const payload = {
      patientId: selectedPatient,
      doctorId: userID,
      date: selectedDate.format("YYYY-MM-DD"),
      slotTime: selectedTime, // selectedTime now holds "09:00–10:00"
      status: "Confirmed",
      remarks: remark,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/createAppointment`,
        payload
      );
      notification.success({ message: "Appointment created successfully" });
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      const error = err.response?.data?.message || "Something went wrong.";
      notification.error({ message: error });
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
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {showTodayOnly ? "All" : "Today's"}
        </Button>
        <Button className="add-button" type="primary" onClick={openAddModal}>
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
          {filteredAppointments?.map((a) => (
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
                <div style={{ fontSize: "200%" }}>{a.slotTime}</div>
                <div>{a.patientId?.name || "Deleted Patient"}</div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <table
          className="appointment-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Patient
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Status
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr
                key={a._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedAppointment(a);
                  setShowDetailsModal(true);
                }}
              >
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
                  {a.status}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <Button
                    type="link"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(a._id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleAddSubmit}
        confirmLoading={modalLoading}
        okText="Create"
        centered
      >
        <h3>Add Appointment</h3>
        Patient:
        <Select
          value={selectedPatient}
          placeholder="Select Patient"
          onChange={setSelectedPatient}
          style={{ width: "100%", marginBottom: 16 }}
        >
          {patients?.map((patient) => (
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
        <Select
          placeholder="Select Time Slot"
          value={selectedTime}
          onChange={setSelectedTime}
          style={{ width: "100%", marginBottom: 16 }}
        >
          {[
            "09:30 – 10:30",
            "10:30 – 11:30",
            "11:30 – 12:30",
            "12:30 – 13:30",
            "13:30 – 14:30",
            "14:30 – 15:30",
            "15:30 – 16:30",
          ].map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
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
        open={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        footer={null}
        centered
      >
        <h3>Appointment Details</h3>
        <Card
          style={{
            background: `radial-gradient(circle,${getCardColor(
              selectedAppointment?.status
            )}99,#00000033`,
            color: "white",
            fontSize: "18px",
            border: "1px solid #00000077",
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
            <b>Time Slot:</b> {selectedAppointment?.slotTime}
          </p>

          <p>
            <b>Remarks:</b> {selectedAppointment?.remarks || "No Remarks"}
            {/* <TextArea
              rows={4}
              placeholder="Enter any remarks (optional)"
              value={selectedAppointment?.remarks}
              onChange={(e) => setRemark(e.target.value)}
              style={{ marginBottom: 16 }}
            /> */}
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
          <Button
            style={{ background: "none" }}
            block
            type="link"
            danger
            onClick={() => confirmDelete(selectedAppointment._id)}
          >
            Delete
          </Button>
        </Card>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
