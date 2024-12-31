import React, { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";

const TimeSlotDropdown = ({ selectedDoctor, selectedDate, onSelectTimeSlot, disabled }) => {
  const { Option } = Select;
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAvailableSlots = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/v1/doctors/availableSlots?doctorId=${selectedDoctor}&date=${selectedDate.format("YYYY-MM-DD")}`);
          setTimeSlots(response.data.availableSlots);
        } catch (error) {
          console.error("Error fetching available slots:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAvailableSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  return (
    <Select
      placeholder="Select Time Slot"
      onChange={onSelectTimeSlot}
      style={{ width: '100%' }}
      loading={loading}
      disabled={disabled}
    >
      {timeSlots.length > 0 ? (
        timeSlots.map((slot) => (
          <Option key={slot} value={slot}>
            {slot}
          </Option>
        ))
      ) : (
        <Option disabled>No available slots</Option>
      )}
    </Select>
  );
};

export default TimeSlotDropdown;
