import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    try {
      const response = await axios.post("/api/v1/doctor/login", {
        phoneNumber,
      });
      if (response.data.success) {
        setSuccess("Login successful!");
        setError("");
        localStorage.setItem("token", response.data.token); // Store JWT token
        const userData = response.data.user;
        console.log(userData); // Assuming user data is returned in the response

        // Redirect or perform additional actions here
        navigate("/");
      } else {
        setError(response.data.message || "Invalid phone number");
        setSuccess("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Doctor Login
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="phoneNumber"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default DoctorLogin;
