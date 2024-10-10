import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./pages/Sidebar"; // Import the Sidebar component
import { Layout } from "antd"; // Import Ant Design Layout components
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import ProfileCompletion from "./pages/ProfileCompletion";
function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            {/* Login and Register routes do not have a sidebar */}

            <Route
              path="/login"
              element={
                <PublicRoutes>
                  <Login />
                </PublicRoutes>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoutes>
                  <Register />
                </PublicRoutes>
              }
            />
            <Route
              path="/comProfile"
              element={
                <ProtectedRoutes>
                  <ProfileCompletion />
                </ProtectedRoutes>
              }
            />

            {/* Routes with Sidebar */}
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Layout style={{ height: "100vh" }}>
                    <Sidebar /> {/* Sidebar Component */}
                    <Layout>
                      {/* The content for Homepage will be displayed here */}

                      <Homepage />
                    </Layout>
                  </Layout>
                </ProtectedRoutes>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
