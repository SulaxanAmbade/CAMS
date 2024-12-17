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
import DoctorSchedule from "./components/functions/DoctorSchedule"; // Import the DoctorSchedule component
import Sidebar from "./pages/Sidebar";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import PatientProfile from "./components/profile/PatientProfile";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  const { user } = useSelector((state) => state.user); // Access user data

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            {/* Public routes like login and register do not show the sidebar */}
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
              path="/"
              element={
                <ProtectedRoutes>
                  <ProtectedLayout>
                    <Homepage />
                  </ProtectedLayout>
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor-login"
              element={
                <PublicRoutes>
                  <DoctorLogin />
                </PublicRoutes>
              }
            />
            <Route
              path="/patient-login"
              element={
                <PublicRoutes>
                  <PatientLogin />
                </PublicRoutes>
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
              path="/patientProfile"
              element={
                <ProtectedRoutes>
                  <ProtectedLayout>
                    <PatientProfile />
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
            {/* Add route for viewing doctor schedule */}
            <Route
              path="/schedule/:doctorId" // Dynamic route for doctor schedule
              element={
                <ProtectedRoutes>
                  <ProtectedLayout>
                    <DoctorSchedule />
                  </ProtectedLayout>
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
