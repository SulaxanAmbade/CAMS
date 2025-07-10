import React from "react";
import "./SplashScreen.css";

const SplashScreen = () => {
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
