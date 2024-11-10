import React, { useEffect, useState } from "react";
import { Table, Button, Modal, notification as message, DatePicker, Spin, Alert } from "antd";
import axios from "axios";
import moment from "moment"; // Import moment for date handling
import AppointmentForm from "../functions/AppointmentForm";

export const StaffDashboard = () => {
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]); // State for doctors
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [loadingAppointments, setLoadingAppointments] = useState(false); // Loading state for appointments
  const [APPform, setAPPform] = useState(false);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/v1/patient/getAllPatient");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatientData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/v1/doctor/getAllDoctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctorData(data.data);
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await axios.get("/api/v1/appointment/getAllAppointments");
      setAppointments(response.data.data);
    } catch (error) {
      message.error("Error fetching appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchPatients(); // Fetch patients when the component mounts
    fetchDoctors(); // Fetch doctors when the component mounts
    fetchAppointments(); // Fetch appointments when the component mounts
  }, []);

  const handleDeletePatient = async (patientId) => {
    if (!patientId) {
      message.error({ message: "Invalid patient ID!" });
      return;
    }
    try {
      const response = await fetch(`/api/v1/patient/deletePatient/${patientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      setPatientData(patientData.filter((patient) => patient._id !== patientId));
      message.success({ message: "Patient deleted successfully!" });
    } catch (error) {
      message.error({ message: error.message });
    }
  };

  const handleAppointmentButton = () => {
    setAPPform(true);
  };
  const handleappformclose = () => {
    setAPPform(false);
  };

  // Define columns for patients table
  const patientColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => moment(text).format("YYYY-MM-DD"), // Format the date for display
    },
    { title: "Contact No", dataIndex: "contactNo", key: "contactNo" },
    {
      title: "Emergency Contact",
      dataIndex: "emergencyContact",
      key: "emergencyContact",
    },
    {
      title: "Medical History",
      dataIndex: "medicalHistory",
      key: "medicalHistory",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" danger onClick={() => handleDeletePatient(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  // Define columns for doctors table
  const doctorColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Visiting Hours Start",
      dataIndex: ["visitingHours", "start"],
      key: "visitingHours.start",
    },
    {
      title: "Visiting Hours End",
      dataIndex: ["visitingHours", "end"],
      key: "visitingHours.end",
    },
    {
      title: "Visiting Days",
      dataIndex: ["visitingHours", "days"],
      key: "visitingHours.days",
      render: (days) => (days ? days.join(", ") : "N/A"),
    },
    {
      title: "Time slot Duration",
      dataIndex: ["visitingHours", "slot"],
      key: "visitingHours.slot",
    },
  ];

  // Define columns for appointments table
  const appointmentColumns = [
    {
      title: "Patient Name",
      dataIndex: "patientId",
      key: "patientId",
      render: (patient) => patient.name,
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctor) => doctor.name,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Time", dataIndex: "time", key: "time" },
  ];

  return (
    <>
      <h3>Patient</h3>
      <Table dataSource={patientData} columns={patientColumns} pagination={false} />

      <h3>Available Doctors</h3>
      <Table dataSource={doctorData} columns={doctorColumns} pagination={false} />

      <h3>All Appointments</h3>
      {loadingAppointments ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={appointments} columns={appointmentColumns} rowKey="_id" pagination={{ pageSize: 10 }} />
      )}

      <Button onClick={handleAppointmentButton} style={{ marginTop: "1rem" }}>Add Appointment</Button>

      <Modal open={APPform} onOk={handleappformclose} onCancel={handleappformclose}>
        <AppointmentForm />
        <Alert message="Clicking on 'OK' does not schedule the appointment" type="warning" />
      </Modal>
    </>
  );
};

export default StaffDashboard;
