import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, notification as message } from 'antd';

const DoctorSchedule = () => {
  const { doctorId } = useParams(); // Get the doctorId 
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/v1/schedule/${doctorId}`); 
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setScheduleData(data); // Adjust based on your API response structure
      } catch (error) {
        message.error({ message: error.message });
      }
    };

    fetchSchedule();
  }, [doctorId]);

  return (
    <div>
      <h1>Schedule for Doctor ID: {doctorId}</h1>
      <Table dataSource={scheduleData} columns={[
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Time', dataIndex: 'time', key: 'time' },
        { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName' },
        // Add other columns if needed
      ]} />
    </div>
  );
};

export default DoctorSchedule;
