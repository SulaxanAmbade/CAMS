import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
const HomePage = () => {
const {user} =useSelector(state => state.user)
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user && (
        <div>
          <h2>{user?.role}</h2>
          <p>Name: {user?.name}</p>
          <p>Phone Number: {user?.contactNo}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
