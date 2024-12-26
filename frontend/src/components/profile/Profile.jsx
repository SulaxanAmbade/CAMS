import { Card, Avatar } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
const PatientProfile = () => {
  const { user } = useSelector((state) => state.user);
  const cardDetails = { color: "white" };
  const dob = new Date(user?.dateOfBirth).toLocaleDateString("en-GB");
  return (
    <>
      <Card style={{ background: "#b7202eee", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={cardDetails}>
            {user?.role === "Patient" && (
              <>
                <b>
                  <h2>{user?.role}</h2>
                </b>
                <h3>Name : {user?.name}</h3> <h3>{user?.gender}</h3>
                <h3>Contact Number : {user?.contactNo}</h3>
                <h3>Date of Birth : {dob}</h3>
                <h4>Medical History : {user?.medicalHistory}</h4>
              </>
            )}

            {user?.role === "Doctor" && (
              <>
                <b>
                  <h2>{user?.role}</h2>
                </b>
                <h3>Name : {user?.name}</h3> <h3>{user?.gender}</h3>
                <h3>Contact Number : {user?.contactNo}</h3>
                <h4>Specialization : {user?.specialization}</h4>
              </>
            )}

            {user?.role === "Staff" && (
              <>
                <b>
                  <h2>{user?.role}</h2>
                </b>
                <h3>Name : {user?.name}</h3> <h3>{user?.gender}</h3>
                <h3>Contact Number : {user?.contactNo}</h3>
              </>
            )}
          </div>
          <Avatar size={128} icon={<UserOutlined />} />
        </div>
      </Card>
    </>
  );
};

export default PatientProfile;
