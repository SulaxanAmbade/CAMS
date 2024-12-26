import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  notification as message,
  Spin,
  Input,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

export const StaffDashboard = () => {
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [searchText, setSearchText] = useState(""); // Search text state
  const [showTodayOnly, setShowTodayOnly] = useState(false); // Today's filter state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/api/v1/patient/getAllPatient");
      setPatientData(response.data.data);
    } catch (error) {
      message.error("Failed to fetch patients.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/v1/doctor/getAllDoctors");
      setDoctorData(response.data.data);
    } catch (error) {
      message.error("Failed to fetch doctors.");
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await axios.get(
        "/api/v1/appointment/getAllAppointments"
      );
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (selectedPatient && selectedDoctor && selectedDate && selectedTime) {
      setLoadingForm(true);

      // Find the selected doctor and check their visiting hours
      const doctor = doctorData.find((doc) => doc._id === selectedDoctor);

      if (doctor) {
        const { visitingHours } = doctor;
        const startHour = visitingHours.start;
        const endHour = visitingHours.end;
        const selectedHour = selectedTime.format("HH:mm");

        if (selectedHour < startHour || selectedHour > endHour) {
          message.error({
            message: `Selected time is outside the doctor's visiting hours. Please select a time between ${startHour} and ${endHour}.`,
          });
          setLoadingForm(false);
          return;
        }
      }

      try {
        const response = await axios.post(
          "/api/v1/appointment/createAppointment",
          {
            patientId: selectedPatient,
            doctorId: selectedDoctor,
            date: selectedDate.format("YYYY-MM-DD"),
            time: selectedTime.format("HH:mm"),
          }
        );

        if (response.data.success) {
          message.success({ message: "Appointment scheduled successfully" });
          setShowAppointmentForm(false);
          setSelectedPatient("");
          setSelectedDoctor("");
          setSelectedDate(null);
          setSelectedTime(null);
          fetchAppointments();
        } else {
          message.error({
            message: "Failed to schedule appointment. Please try again.",
          });
        }
      } catch (error) {
        message.error({
          message: "Failed to schedule appointment. Please try again.",
          error,
        });
      } finally {
        setLoadingForm(false);
      }
    } else {
      message.info({ message: "Please fill all fields." });
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/v1/appointment/updateStatus/${appointmentId}`, {
        status: newStatus,
      });
      message.success({ message: "Status updated successfully" });
      fetchAppointments();
    } catch (error) {
      message.error({ message: "Error updating status." });
    }
  };

  const statusOrder = [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "No-Show",
  ];

  const today = moment().format("YYYY-MM-DD");

  const groupedAppointments = statusOrder.map((status) => ({
    status,
    appointments: appointments
      .filter((appointment) => appointment.status === status)
      .filter((appointment) => {
        const isToday = showTodayOnly
          ? moment(appointment.date).format("YYYY-MM-DD") === today
          : true;

        const patientName = appointment.patientId?.name?.toLowerCase() || "";
        const doctorName = appointment.doctorId?.name?.toLowerCase() || "";

        return (
          isToday &&
          (patientName.includes(searchText.toLowerCase()) ||
            doctorName.includes(searchText.toLowerCase()))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        return moment(a.time, "HH:mm") - moment(b.time, "HH:mm");
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
      title: "Doctor Name",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctor) => (doctor ? doctor.name : "Deleted Doctor"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Update Status",
      key: "update",
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: 120 }}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Completed">Completed</Option>
          <Option value="No-Show">No-Show</Option>
        </Select>
      ),
    },
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
          style={{
            marginBottom: 16,
            width: "300px",
          }}
        />
        <Button
          style={{ background: "#b7202eee", color: "white" }}
          onClick={() => setShowTodayOnly(!showTodayOnly)}
        >
          {showTodayOnly ? "Show All" : "Show Today's Appointments"}
        </Button>
        <Button
          style={{ background: "#b7202eee", color: "white" }}
          onClick={() => setShowAppointmentForm(true)}
        >
          Add Appointment
        </Button>
      </div>

      {loadingAppointments ? (
        <Spin size="large" />
      ) : (
        groupedAppointments?.map((group) => (
          <div key={group.status} style={{ marginBottom: "40px" }}>
            <h4>{group.status} Appointments</h4>
            <Table
              dataSource={group.appointments}
              columns={appointmentColumns}
              pagination={false}
              rowKey={(record) => record._id}
            />
          </div>
        ))
      )}

      <Modal
        open={showAppointmentForm}
        footer={null}
        onCancel={() => setShowAppointmentForm(false)}
      >
        <h2>Schedule Appointment</h2>
        <Select
          placeholder="Select Patient"
          value={selectedPatient}
          onChange={setSelectedPatient}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {patientData?.map((patient) => (
            <Option key={patient._id} value={patient._id}>
              {patient.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Doctor"
          value={selectedDoctor}
          onChange={setSelectedDoctor}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {doctorData?.map((doctor) => (
            <Option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          disabled={!selectedDoctor}
          style={{ width: "100%", marginBottom: "1rem" }}
          disabledDate={(current) =>
            current && current < moment().startOf("day")
          }
        />
        <TimePicker
          placeholder="Select Time"
          value={selectedTime}
          onChange={setSelectedTime}
          disabled={!selectedDoctor || !selectedDate}
          format="HH:mm"
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Button
          type="primary"
          onClick={handleScheduleAppointment}
          loading={loadingForm}
          style={{ marginTop: "1rem" }}
        >
          Schedule Appointment
        </Button>
      </Modal>
    </>
  );
};

export default StaffDashboard;
