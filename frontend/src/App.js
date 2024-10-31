import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import ProtectedLayout from "./components/ProtectedLayout";
import DoctorManagement from "./components/StaffFunctions/DoctorManagement";
import PatientManagement from "./components/StaffFunctions/PatientManagement";

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
    </>
  );
}

export default App;
