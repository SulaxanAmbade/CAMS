import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Form,
  Select,
  Space,
  Typography,
  Input,
  Modal,
  Button,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  CopyrightOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import StaffDashboard from "../components/dashboard/StaffDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import Profile from "../components/profile/Profile";
import { setUser } from "../redux/features/userSlice";
import "../css/homepage.css";
import logo from "../assets/logoRs.svg";
import kjLogo from "../assets/kjsieit-logowhite.svg";
import PatientManagement from "../components/functions/PatientManagement";
import StaffManagement from "../components/functions/StaffManagement";
const { Header, Content, Footer } = Layout;

const HomePage = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  // Modal and doctor form state
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [doctorForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [view, setView] = useState("appointments");
  const handleAddDoctor = async (values) => {
    try {
      values.name = `Dr. ${values.name}`;
      values.contactNo = `+91${values.contactNo}`;
      const response = await axios.post("/api/v1/doctor/addNewDoctor", values);
      if (response.data.success) {
        message.success("Doctor added successfully!");
        setIsDoctorModalVisible(false);
        doctorForm.resetFields();
      } else {
        message.error(response.data.message || "Failed to add doctor");
      }
    } catch (error) {
      message.error("Error adding doctor");
    }
  };
  const menuItems = [
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Appointments",
    },
  ];

  if (user?.role === "doctor") {
    menuItems.splice(
      1,
      0,
      {
        key: "patients",
        icon: <TeamOutlined />,
        label: "Patients",
      },
      {
        key: "staff",
        icon: <UsergroupAddOutlined />,
        label: "Staff",
      }
    );
  }
  if (user?.role === "staff") {
    menuItems.splice(1, 0, {
      key: "patients",
      icon: <TeamOutlined />,
      label: "Patients",
    });
  }
  if (user?.role === "doctor" && user?.contactNo === "+919921118724") {
    menuItems.splice(1, 0, {
      key: "register",
      icon: <UsergroupAddOutlined />,
      label: "Add A Doctor",
    });
  }

  const renderDashboard = () => {
    if (view === "profile") return <Profile />;
    if (view === "patients") return <PatientManagement />;
    if (view === "staff") return <StaffManagement />;
    if (user?.role === "staff") return <StaffDashboard />;
    if (user?.role === "doctor") return <DoctorDashboard />;
    if (user?.role === "patient") return <PatientDashboard />;
    return null;
  };

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div>
          <img src={logo} className="logo" alt="logo" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys="none"
          onClick={(e) => {
            if (e.key === "register") setIsDoctorModalVisible(true);
            else setView(e.key);
          }}
          items={menuItems}
          className="home-menu"
        />
        <Space style={{ cursor: "pointer" }} onClick={() => setView("profile")}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ color: "white" }}>{user?.name}</span>
        </Space>
      </Header>

      <Content style={{ minHeight: "100vh", padding: 8 }}>
        {renderDashboard()}
      </Content>
      <Footer className="footerSection">
        <div className="footerLogoDiv">
          <img className="footerLogo" src={kjLogo} alt="" />
        </div>
        <div className="team">
          <CopyrightOutlined /> <b>Developed with Care</b> <hr />
          Project Guide : Dr. Sheetal Jagtap <br /> Om Bankar & Sulaxan Ambade
        </div>
        <div className="college">
          Department of Artificial Intelligence and Data Science <br /> K.J.
          Somaiya Institute of Technology, Sion
        </div>
      </Footer>
      <Modal
        open={isDoctorModalVisible}
        onCancel={() => setIsDoctorModalVisible(false)}
        footer={null}
      >
        <h3>Add New Doctor</h3>
        <Form form={doctorForm} onFinish={handleAddDoctor}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the doctor's name!" },
            ]}
          >
            <Input addonBefore="Dr." />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the doctor's password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              { required: true, message: "Please input the specialization!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contactNo"
            rules={[
              { required: true, message: "Please input the contact number!" },
              {
                pattern: /^\d{10}$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input addonBefore="+91" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
