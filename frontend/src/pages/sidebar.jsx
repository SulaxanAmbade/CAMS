import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
  HomeOutlined, // Import Home icon
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/features/userSlice";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/login");
  };

  const handleCompleteProfile = () => {
    navigate("/comProfile");
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        className="logo"
        style={{ color: "white", textAlign: "center", padding: "10px" }}
      >
        <Link to="/" style={{ color: "white", fontSize: "24px" }}>
          <HomeOutlined /> {/* Home icon */}
        </Link>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {user?.role === "Patient" && (
          <>
            <Menu.Item key="1" icon={<UserOutlined />}>
              My Profile
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              My Appointments
            </Menu.Item>
          </>
        )}

        {user?.role === "Doctor" && (
          <>
            <Menu.Item key="1" icon={<UserOutlined />}>
              Patient List
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              My Schedule
            </Menu.Item>
          </>
        )}

        {user?.role === "Staff" && (
          <>
            <Menu.Item
              key="managePatients"
              icon={<SolutionOutlined />}
              onClick={() => navigate("/manage-patients")}
            >
              Manage Patients
            </Menu.Item>
            <Menu.Item
              key="manageDoctors"
              icon={<MedicineBoxOutlined />}
              onClick={() => navigate("/manage-doctors")}
            >
              Manage Doctors
            </Menu.Item>
          </>
        )}

        <Menu.Item key="completeProfile" icon={<UserOutlined />} onClick={handleCompleteProfile}>
          Complete your Profile
        </Menu.Item>

        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ position: "absolute", bottom: "60px", width: "100%" }}
        >
          Logout
        </Menu.Item>
      </Menu>
      <Button
        onClick={toggleCollapse}
        size="large"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          color: "rgb(215,100,119)",
        }}
      >
        {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </Button>
    </Sider>
  );
};

export default Sidebar;
