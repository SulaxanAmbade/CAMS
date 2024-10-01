import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './pages/Sidebar';  // Import the Sidebar component
import { Layout } from 'antd';     // Import Ant Design Layout components

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login and Register routes do not have a sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with Sidebar */}
          <Route 
            path="/" 
            element={
              <Layout style={{ height: '100vh' }}>
                <Sidebar />         {/* Sidebar Component */}
                <Layout>
                  {/* The content for Homepage will be displayed here */}
                  <Homepage />      
                </Layout>
              </Layout>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
