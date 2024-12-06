import React from "react";
import { Layout } from "antd"; 
import Sidebar from "../../pages/Sidebar"; 
const ProtectedLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout style={{overflow:'scroll'}}>
        <div style={{ padding: "20px" }}>{children}</div>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
