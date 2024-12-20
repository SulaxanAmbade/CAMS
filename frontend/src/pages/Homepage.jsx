import React, { useState } from "react";
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
import Profile from "../components/profile/Profile";
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [profileCard, setProfileCard] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/login");
  };
  return (
    <div style={{ maxWidth: "100vw" }}>
      <Card style={{ background: "#b7202eee", padding: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ color: "white" }}>CAMS</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexGrow: 0.5,
            }}
          >
            {!profileCard ? (
              <>
                {" "}
                <Button
                  className="LogButton"
                  onClick={() => {
                    setProfileCard(true);
                  }}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <Button
                className="LogButton"
                onClick={() => {
                  setProfileCard(false);
                }}
              >
                Appointments
              </Button>
            )}
            {user?.role === "Staff" && (
              <>
                <Button
                  className="LogButton"
                  onClick={() => navigate("/manage-patients")}
                >
                  Patients
                </Button>
                <Button
                  className="LogButton"
                  onClick={() => navigate("/manage-doctors")}
                >
                  Doctors
                </Button>
              </>
            )}
            <Button
              className="LogButton"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
            />
          </div>
        </div>
      </Card>
      {profileCard ? (
        <Profile />
      ) : (
        <div style={{ padding: "10px" }}>
          {" "}
          {user?.role === "Staff" && <StaffDashboard />}
          {user?.role === "Patient" && <PatientDashboard />}
          {user?.role === "Doctor" && <DoctorDashboard />}
        </div>
      )}
    </div>
  );
};

export default HomePage;
