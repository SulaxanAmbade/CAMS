import React, { useEffect } from "react";
import "../css/SplashScreen.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If user is already logged in, prevent splash screen
    if (token) {
      navigate("/", { replace: true }); // or redirect to /dashboard if needed
      return;
    }
    const timeout = setTimeout(() => {
      navigate("/", { replace: true }); // Navigate to homepage after 2s
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);
  return (
    <div className="splash-container">
      <div className="svg-wrapper">
        <Logo className="animated-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;
