import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import StaffDashboard from "../components/dashboard/StaffDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import Profile from "../components/profile/Profile";
import { setUser } from "../redux/features/userSlice";
import "../css/homepage.css";
import logo from "../assets/logoRs.svg";

const { Header, Content } = Layout;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [view, setView] = useState("appointments");

  const menuItems = [
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Appointments",
    },
  ];

  if (user?.role === "staff") {
    menuItems.splice(
      1,
      0,
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
    if (user?.role === "staff") return <StaffDashboard />;
    if (user?.role === "doctor") return <DoctorDashboard />;
    if (user?.role === "patient") return <PatientDashboard />;
    return null;
  };

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div>
          <img src={logo} className="logo" alt="logo" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys="appointments"
          onClick={(e) => {
            if (e.key === "patients") navigate("/manage-patients");
            else if (e.key === "doctors") navigate("/manage-doctors");
            else setView(e.key);
          }}
          items={menuItems}
          className="home-menu"
        />
        <Space style={{ cursor: "pointer" }} onClick={() => setView("profile")}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ color: "white" }}>{user?.name}</span>
        </Space>
      </Header>

      <Content style={{ padding: 8 }}>{renderDashboard()}</Content>
    </Layout>
  );
};

export default HomePage;
