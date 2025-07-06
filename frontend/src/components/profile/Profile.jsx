import React from "react";
import { Card, Avatar, Typography, Tag, Descriptions } from "antd";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const getRoleTag = (role) => {
  switch (role) {
    case "patient":
      return <Tag color="blue">Patient</Tag>;
    case "doctor":
      return <Tag color="green">Doctor</Tag>;
    case "staff":
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
        background: "#291806",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: "24px",
          justifyContent: "space-between",
          alignItems: "flex-start",
          color: "white",
        }}
      >
        {/* Profile Info */}
        <div
          style={{
            flex: 1,
            minWidth: "250px",
            maxWidth: "100%",
          }}
        >
          <Title level={3} style={{ marginBottom: 0, color: "white" }}>
            {user?.name} {getRoleTag(user?.role)}
          </Title>
          <p style={{ color: "#aaa", marginBottom: 24 }}>{user?.gender}</p>

          <Descriptions
            column={1}
            layout="horizontal"
            labelStyle={{ fontWeight: "bold", color: "#ccc" }}
            contentStyle={{ marginBottom: "8px", color: "white" }}
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

        {/* Avatar */}
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Avatar
            size={128}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#eb763f",
              marginTop: 8,
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default PatientProfile;
