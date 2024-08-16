import React from 'react'
import { Menu } from 'antd'
const Sidebar = () => {
  return (
    <>
    <Menu 
        mode='vertical'
      style={{ width: 256 }} 
      items={[{key:'1',label:'1'},{key:'1',label:'1'},{key:'1',label:'1'}]}
      defaultSelectedKeys={['1']}
      />
    </>
  )
}

export default Sidebar
