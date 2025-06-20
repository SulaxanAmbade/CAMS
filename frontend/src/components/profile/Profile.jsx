import React from "react";
import { Card, Avatar, Typography, Tag, Descriptions } from "antd";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const getRoleTag = (role) => {
  switch (role) {
    case "Patient":
      return <Tag color="blue">Patient</Tag>;
    case "Doctor":
      return <Tag color="green">Doctor</Tag>;
    case "Staff":
      return <Tag color="volcano">Staff</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

const PatientProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dob =
    user?.dateOfBirth && new Date(user.dateOfBirth).toLocaleDateString("en-GB");

  return (
    <Card
      bordered={false}
      style={{
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            {user?.name} {getRoleTag(user?.role)}
          </Title>
          <p style={{ color: "#888", marginBottom: 24 }}>{user?.gender}</p>

          <Descriptions
            column={1}
            layout="horizontal"
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ marginBottom: "8px" }}
          >
            <Descriptions.Item label="Contact No">
              {user?.contactNo}
            </Descriptions.Item>

            {user?.role === "Patient" && (
              <>
                <Descriptions.Item label="Date of Birth">
                  {dob}
                </Descriptions.Item>
                <Descriptions.Item label="Medical History">
                  {user?.medicalHistory || "N/A"}
                </Descriptions.Item>
              </>
            )}

            {user?.role === "Doctor" && (
              <>
                <Descriptions.Item label="Specialization">
                  {user?.specialization}
                </Descriptions.Item>
                <Descriptions.Item label="Visiting Hours">
                  {user?.visitingHours?.start} - {user?.visitingHours?.end}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </div>

        <Avatar
          size={128}
          icon={<UserOutlined />}
          style={{
            backgroundColor: "#b7202e",
            marginLeft: "auto",
            marginTop: 8,
          }}
        />
      </div>
    </Card>
  );
};

export default PatientProfile;
