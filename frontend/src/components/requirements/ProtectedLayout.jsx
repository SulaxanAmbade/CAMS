import React from "react";
import { Layout } from "antd";
const ProtectedLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout style={{ overflow: "scroll" }}>
        <div style={{ padding: "20px" }}>{children}</div>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
