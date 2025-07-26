import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  message,
  Input,
  Radio,
  DatePicker,
  Spin,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { getFcmToken } from "../../firebase"; // 🔸 Import FCM logic
import Spinner from "../requirements/Spinner";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const userID = user._id;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchAppointments();
    const setupFcm = async () => {
      const token = await getFcmToken();
      if (token) {
        try {
          await axios.post(
            `${process.env.REACT_APP_BACKEND}/api/v1/patient/save-token`,
            { token },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("✅ FCM Token sent to backend");
        } catch (error) {
          console.error("❌ Error saving FCM token:", error);
        }
      }
    };

    setupFcm();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/v1/appointment/getPatientAppointment`,
        { userID }
      );
      setAppointments(res.data.data || []);
    } catch {
      message.error("Error fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  const statusOrder = ["Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredAppointments = appointments
    .filter((a) => (filterStatus !== "All" ? a.status === filterStatus : true))

    .filter((a) => {
      const inDateRange = dateRange
        ? moment(a.date).format("YYYY-MM-DD") >=
            dateRange[0].format("YYYY-MM-DD") &&
          moment(a.date).format("YYYY-MM-DD") <=
            dateRange[1].format("YYYY-MM-DD")
        : true;

      const doctorName = a.doctorId?.name?.toLowerCase() || "";
      return inDateRange && doctorName.includes(searchText.toLowerCase());
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
      <h3 className="dashboard-header">All Appointments</h3>

      <div className="dashboard-controls">
        <Input
          placeholder="Search by Doctor's Name"
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
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredAppointments.map((a) => (
            <Col xs={24} sm={12} md={8} lg={6} key={a._id}>
              <Card
                hoverable
                style={{
                  background: `linear-gradient(0deg,#000000,${getCardColor(
                    a.status
                  )})`,
                  border: isTomorrowConfirmed(a) ? "2px solid #ff0000" : "none",
                }}
                className="card-style"
              >
                {isTomorrowConfirmed(a) ? (
                  <Tag color="red" style={{ marginBottom: 8 }}>
                    Tomorrow's Confirmed Appointment
                  </Tag>
                ) : (
                  <div>{a.status}</div>
                )}

                <div style={{ fontSize: "200%" }}>
                  {moment(a.date).format("DD MMMM")}
                </div>
                <div>{moment(a.date).format("YYYY")}</div>
                <div style={{ fontSize: "200%" }}>{a.slotTime}</div>
                <div>{a.doctorId?.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PatientDashboard;
