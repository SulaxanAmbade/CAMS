import { Card, Avatar } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
const PatientProfile = () => {
  const { user } = useSelector((state) => state.user);
  const cardDetails = { color: "white" };
  return (
    <>
      <Card style={{ background: "#b7202e", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={cardDetails}>
            <b>
              <h2>{user?.role}</h2>
            </b>
            <h3>Name : {user?.name}</h3> <h3>{user?.gender}</h3>
            <h3>Contact Number : {user?.contactNo}</h3>
            <h3>Date of Birth : {user?.dateOfBirth.split("T")[0]}</h3>
            <h4>Medical History : {user?.medicalHistory}</h4>
          </div>
          <Avatar size={128} icon={<UserOutlined />} />
        </div>
      </Card>
    </>
  );
};

export default PatientProfile;
