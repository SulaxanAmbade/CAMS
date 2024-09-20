import React from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const token = localStorage.getItem('token')

  const location = useLocation();
  const { user } = location.state || {}; // Get user details from location state

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user && (
        <div>
          <h2>User Details:</h2>
          <p>Name: {user.name}</p>
          <p>Phone Number: {user.contactNo}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
