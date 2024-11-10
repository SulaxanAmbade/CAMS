import { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";

const DoctorDropdown = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    axios
      .get("/api/v1/doctor/getAllDoctors") // Adjust endpoint as needed
      .then((response) => {
        // Verify the response contains data in expected format
        const doctorList = Array.isArray(response.data.data) ? response.data.data : [];
        setDoctors(doctorList);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  return (
    <Select
      placeholder="Select Doctor"
      onChange={(value) => onSelectDoctor(value)}
      style={{ width: '100%' }}
    >
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <Option key={doctor._id} value={doctor._id}>
            {doctor.name} ({doctor.specialization})
          </Option>
        ))
      ) : (
        <Option disabled>Loading doctors...</Option>
      )}
    </Select>
  );
};

export default DoctorDropdown;
