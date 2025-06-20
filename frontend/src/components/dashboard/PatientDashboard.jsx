import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Input, Radio, Spin, Card, Row, Col, Tag } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const userID = user.ID;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/appointment/getPatientAppointment",
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
      const doctorName = a.doctorId?.name?.toLowerCase() || "";
      return doctorName.includes(searchText.toLowerCase());
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
      <h3>All Appointments</h3>

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
          placeholder="Search by Doctor's Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 8 }}
        />

        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>Filter by Status:</span>
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
        </div>
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
                  border: isTomorrowConfirmed(a) ? "2px solid #ff0000" : "none",
                }}
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
                <div style={{ fontSize: "200%" }}>{a.time}</div>
                <div>{a.doctorId?.name || "Deleted Doctor"}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PatientDashboard;
