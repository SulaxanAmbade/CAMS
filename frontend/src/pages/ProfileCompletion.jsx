import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PatientProfileForm from "../components/forms/PatientForm";
import StaffProfileForm from "../components/forms/StaffForm";
import DoctorProfileForm from "../components/forms/DoctorForm";

const ProfileCompletion = () => {
  const { user } = useSelector((state) => state.user); // Get logged-in user info
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user is logged in
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Complete Your Profile</h2>
      {user?.role === "Patient" && <PatientProfileForm />}
      {user?.role === "Doctor" && <DoctorProfileForm />}
      {user?.role === "Staff" && <StaffProfileForm />}
    </div>
  );
};

export default ProfileCompletion;
