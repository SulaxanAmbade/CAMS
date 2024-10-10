// ProtectedLayout.js
import React from "react";
import { Layout } from "antd"; // Using Ant Design's Layout
import Sidebar from "../pages/Sidebar"; // Sidebar component

const ProtectedLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar /> 
      <Layout>
        <div style={{ padding: '20px' }}>
          {children} 
        </div>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
