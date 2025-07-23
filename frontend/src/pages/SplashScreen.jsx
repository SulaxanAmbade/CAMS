import React, { useEffect } from "react";
import "../css/SplashScreen.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      sessionStorage.setItem("splashSeen", "true");
      const timeout = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="splash-container">
      <div className="svg-wrapper">
        <Logo className="animated-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;
