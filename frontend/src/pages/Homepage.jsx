import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { StaffDashboard } from "../components/dashboard/StaffDashboard";
const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      {user && (
        <div>
          <h1 style={{position:'sticky', top:"0px"}}>{user?.name}</h1>
        </div>
      )}
      {user?.role === "Staff" && <StaffDashboard />}
      {(user?.role === "Patient" || user?.role === "Doctor") && (
        <div style={{ textAlign: "center" }}>
          Sorry page is still Under Development!
        </div>
      )}
    </div>
  );
};

export default HomePage;
