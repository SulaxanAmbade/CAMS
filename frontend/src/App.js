import React, { useState } from 'react';
import {ThemeProvider} from '@material-ui/core/styles'
import './App.css'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];
const theme ={
  primaryColor: '#blue',
  secondaryColor: '#green',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
};
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ThemeProvider theme={theme}>
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{backgroundColor:'green', color:'white'}}>
        <div className="demo-logo-vertical" />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} style={{backgroundColor:'green', color:'white'}} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: 'green',
          }}
        >
            Appointment Management System
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            Content
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Developed By Students of KJSIT
        </Footer>
      </Layout>
    </Layout>
    </ThemeProvider>
  );
};
export default App;