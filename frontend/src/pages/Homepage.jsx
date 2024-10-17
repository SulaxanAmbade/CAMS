import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { StaffDashboard } from "../components/dashboard/StaffDashboard";
const HomePage = () => {
const {user} =useSelector(state => state.user)
  return (
    <div>
      {user && (
        <div>
          <h1>{user?.name}</h1>
        </div>
      )}
      {user?.role && <StaffDashboard/>}
    </div>
  );
};

export default HomePage;
