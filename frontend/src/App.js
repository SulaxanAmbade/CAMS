import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/requirements/Spinner";
import ProtectedRoutes from "./components/requirements/ProtectedRoutes";
import PublicRoutes from "./components/requirements/PublicRoutes";
import ProtectedLayout from "./components/requirements/ProtectedLayout";
import DoctorManagement from "./components/functions/DoctorManagement";
import PatientManagement from "./components/functions/PatientManagement";
import Profile from "./components/profile/Profile";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); // show splash for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      {loading ? (
        <Spinner />
      ) : (
        <Routes>
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
            path="/*"
            element={
              <ProtectedRoutes>
                <ProtectedLayout>
                  <Homepage />
                </ProtectedLayout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/manage-patients"
            element={
              <ProtectedRoutes>
                <ProtectedLayout>
                  <PatientManagement />
                </ProtectedLayout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/manage-doctors"
            element={
              <ProtectedRoutes>
                <ProtectedLayout>
                  <DoctorManagement />
                </ProtectedLayout>
              </ProtectedRoutes>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
