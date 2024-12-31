import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";

const PatientDropdown = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    // Fetch registered patients from backend
    axios
      .get("/api/v1/patient/getAllPatient") // Adjust endpoint as needed
      .then((response) => {
        // Verify the response contains data in expected format
        const patientList = Array.isArray(response.data.data) ? response.data.data : [];
        setPatients(patientList);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  return (
    <Select
      placeholder="Select Patient"
      onChange={(value) => onSelectPatient(value)}
      style={{ width: '100%' }}
    >
      {patients.length > 0 ? (
        patients.map((patient) => (
          <Option key={patient._id} value={patient._id}>
            {patient.name}
          </Option>
        ))
      ) : (
        <Option disabled>Loading patients...</Option>
      )}
    </Select>
  );
};

export default PatientDropdown;
