import React from "react";
import { Card, Avatar, Typography, Tag, Descriptions, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { setUser } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

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

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dob =
    user?.dateOfBirth && new Date(user.dateOfBirth).toLocaleDateString("en-GB");

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("splashSeen");
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <Card
      bordered={false}
      style={{
        background: "#291806",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        padding: "24px",
        color: "white",
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
        }}
      >
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

            {user?.role === "patient" && (
              <>
                <Descriptions.Item label="Date of Birth">
                  {dob}
                </Descriptions.Item>
                <Descriptions.Item label="Medical History">
                  {user?.medicalHistory || "N/A"}
                </Descriptions.Item>
              </>
            )}

            {user?.role === "doctor" && (
              <>
                <Descriptions.Item label="Specialization">
                  {user?.specialization}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>

          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              marginTop: "24px",
              background: "#ff4d4f",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Logout
          </Button>
        </div>

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

export default Profile;
