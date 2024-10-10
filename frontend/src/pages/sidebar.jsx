import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux"; // To access and manage user state
import { useNavigate } from "react-router-dom"; // To navigate after logout
import { setUser } from "../redux/features/userSlice"; // Import setUser action

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user); // Access user from Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Logout function
  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem("token");
    dispatch(setUser(null)); // Clear user data in Redux

    // Navigate to login page
    navigate("/login");
  };

  // Handle complete profile navigation
  const handleCompleteProfile = () => {
    navigate("/comProfile");
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" style={{ color: "white", textAlign: "center", padding: "10px" }}>
        Clinic System
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {/* Conditionally render menu items based on user role */}
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
            <Menu.Item key="1" icon={<TeamOutlined />}>
              Manage Appointments
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Doctor's Schedule
            </Menu.Item>
          </>
        )}

        {/* Complete Profile button */}
        <Menu.Item key="completeProfile" icon={<UserOutlined />} onClick={handleCompleteProfile}>
          Complete your Profile
        </Menu.Item>

        {/* Logout button */}
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} style={{ position: "absolute", bottom: "60px", width: "100%" }}>
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
