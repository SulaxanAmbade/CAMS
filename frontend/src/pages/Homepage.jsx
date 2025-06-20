import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import StaffDashboard from "../components/dashboard/StaffDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import { setUser } from "../redux/features/userSlice";
import Profile from "../components/profile/Profile";

const { Header, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [view, setView] = useState("appointments");

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/login");
  };

  const menuItems = [
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Appointments",
    },
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "My Profile",
    },
  ];

  if (user?.role === "Staff") {
    menuItems.splice(1, 0,
      {
        key: "patients",
        icon: <TeamOutlined />,
        label: "Patients",
      },
      {
        key: "doctors",
        icon: <UsergroupAddOutlined />,
        label: "Doctors",
      }
    );
  }

  const renderDashboard = () => {
    if (view === "profile") return <Profile />;
    if (user?.role === "Staff") return <StaffDashboard />;
    if (user?.role === "Doctor") return <DoctorDashboard />;
    if (user?.role === "Patient") return <PatientDashboard />;
    return null;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#b7202e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          CAMS
        </Title>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[view]}
          onClick={(e) => {
            if (e.key === "patients") navigate("/manage-patients");
            else if (e.key === "doctors") navigate("/manage-doctors");
            else setView(e.key);
          }}
          items={menuItems}
          style={{
            backgroundColor: "#b7202e",
            borderBottom: "none",
            flex: 1,
            justifyContent: "center",
          }}
        />

        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu>
          }
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ color: "white" }}>{user?.name}</span>
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: 24 }}>
        {renderDashboard()}
      </Content>
    </Layout>
  );
};

export default HomePage;
