import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/RingLoader";
import React from "react";

const Spinner = () => {
  return (
    <div className="spinner">
      <ClipLoader color="white" />
    </div>
  );
};

export default Spinner;
