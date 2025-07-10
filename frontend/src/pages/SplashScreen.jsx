import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SplashScreen.css";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Show splash for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) {
    navigate("/login"); // or redirect wherever you want
    return null;
  }

  return (
    <div className="splash-container">
      <div className="svg-wrapper">
        <object
          type="image/svg+xml"
          data="/logo.svg"
          className="animated-logo"
          aria-label="Ayurveda Logo"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
