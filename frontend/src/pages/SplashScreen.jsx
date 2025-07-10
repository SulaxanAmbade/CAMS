import React from "react";
import "../css/SplashScreen.css";
import { ReactComponent as Logo } from "../assets/logo.svg";

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <div className="svg-wrapper">
        <Logo className="animated-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;
