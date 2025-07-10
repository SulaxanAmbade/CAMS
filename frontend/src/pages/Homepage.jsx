import React, { useState, useEffect } from "react";
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
import SplashScreen from "./SplashScreen";
import "../css/homepage.css";
import logo from "../assets/logo192.png";
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
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("splashSeen") !== "true";
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashSeen", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <Layout className="home-layout">
      <Header className="home-header">
        <div>
          <img src={logo} className="logo"></img>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys="none"
          onClick={(e) => {
            if (e.key === "patients") navigate("/manage-patients");
            else if (e.key === "doctors") navigate("/manage-doctors");
            else setView(e.key);
          }}
          items={menuItems}
          className="home-menu"
        />
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
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

      <Content style={{ padding: 8 }}>{renderDashboard()}</Content>
    </Layout>
  );
};

export default HomePage;
