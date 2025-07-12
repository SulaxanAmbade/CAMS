import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const ProtectedLayout = ({ children }) => {
  const location = useLocation();
  const isSplash = location.pathname === "/splash";

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout style={{ overflow: isSplash ? "hidden" : "scroll" }}>
        <div style={{ margin: isSplash ? "0" : "20px" }}>{children}</div>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
