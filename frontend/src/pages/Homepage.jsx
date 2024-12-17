import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Card, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { StaffDashboard } from "../components/dashboard/StaffDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import { setUser } from "../redux/features/userSlice";
import { LogoutOutlined } from "@ant-design/icons";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/login");
  };
  return (
    <div>
      <Card style={{ background: "#b7202eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ color: "white" }}>CAMS</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexGrow: 0.5,
            }}
          >
            <Button />
            <Button />
            <Button />
            <Button
              size="large"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
            />
          </div>
        </div>
      </Card>
      {user?.ID}
      {user?.role === "Staff" && <StaffDashboard />}
      {user?.role === "Patient" && <PatientDashboard />}
      {user?.role === "Doctor" && <DoctorDashboard />}
    </div>
  );
};

export default HomePage;
