import { useState, useEffect } from "react";
import { DatePicker, Button, Select, message, TimePicker } from "antd";
import moment from "moment";

const { Option } = Select;

const AppointmentForm = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch patients and doctors on component mount
  useEffect(() => {
    const fetchPatientsAndDoctors = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch("https://cams-qgq9.onrender.com/api/v1/patient/getAllPatient"), // Fetch patients
          fetch("https://cams-qgq9.onrender.com/api/v1/doctor/getAllDoctors"), // Fetch doctors
        ]);

        if (!patientsRes.ok || !doctorsRes.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();

        setPatients(Array.isArray(patientsData.data) ? patientsData.data : []);
        setDoctors(Array.isArray(doctorsData.data) ? doctorsData.data : []);
      } catch (error) {
        console.error("Error fetching patients or doctors:", error);
        message.error("Error fetching patients or doctors.");
      }
    };
    fetchPatientsAndDoctors();
  }, []);

  // Function to schedule appointment using fetch
  const handleScheduleAppointment = async () => {
    if (selectedPatient && selectedDoctor && selectedDate && selectedTime) {
      setLoading(true);

      // Find the selected doctor and check their visiting hours
      const doctor = doctors.find((doc) => doc._id === selectedDoctor);

      if (doctor) {
        const { visitingHours } = doctor;
        const startHour = visitingHours.start;
        const endHour = visitingHours.end;
        const selectedHour = selectedTime.format("HH:mm");

        // Check if the selected time is within visiting hours
        if (selectedHour < startHour || selectedHour > endHour) {
          message.error(
            `Selected time is outside the doctor's visiting hours. Please select a time between ${startHour} and ${endHour} ${selectedHour} .`
          );

          setLoading(false);
          return;
        }
      }

      try {
        const response = await fetch("https://cams-qgq9.onrender.com/api/v1/appointment/createAppointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: selectedPatient,
            doctorId: selectedDoctor,
            date: selectedDate.format("YYYY-MM-DD"),
            time: selectedTime.format("HH:mm"),
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to schedule appointment: " + response.statusText
          );
        }

        const result = await response.json();

        if (result.success) {
          message.success("Appointment scheduled successfully");
          // Reset form after success
          setSelectedPatient("");
          setSelectedDoctor("");
          setSelectedDate(null);
          setSelectedTime(null);
        } else {
          console.error("Error response:", result); // Log detailed error from the server
          message.error("Failed to schedule appointment. Please try again.");
        }
      } catch (error) {
        console.error("Error while scheduling appointment:", error); // Log the error details
        message.error("Failed to schedule appointment. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Please select patient, doctor, date, and time.");
    }
  };

  return (
    <div>
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
        placeholder={selectedDoctor}
        value={selectedDoctor}
        onChange={(value) => {
          setSelectedDoctor(value);
          setSelectedDate(null); // Reset date if doctor changes
          setSelectedTime(null); // Reset time if doctor changes
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
          // Reset time if date changes
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

      <Button
        type="primary"
        onClick={handleScheduleAppointment}
        style={{ marginTop: "1rem" }}
        loading={loading}
      >
        Schedule Appointment
      </Button>
    </div>
  );
};

export default AppointmentForm;
