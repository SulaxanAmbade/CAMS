import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '10px' }}>
        Clinic System
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          Patients
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />}>
          Appointments
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />}>
          Doctors
        </Menu.Item>
      </Menu>
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          color: 'white',
        }}
        onClick={toggleCollapse}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  );
};

export default Sidebar;
