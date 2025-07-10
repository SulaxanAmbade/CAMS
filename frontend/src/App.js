import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./components/requirements/Spinner";
import ProtectedRoutes from "./components/requirements/ProtectedRoutes";
import PublicRoutes from "./components/requirements/PublicRoutes";
import ProtectedLayout from "./components/requirements/ProtectedLayout";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorManagement from "./components/functions/DoctorManagement";
import PatientManagement from "./components/functions/PatientManagement";
import Profile from "./components/profile/Profile";

function App() {
  const { loading } = useSelector((state) => state.alerts);

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
