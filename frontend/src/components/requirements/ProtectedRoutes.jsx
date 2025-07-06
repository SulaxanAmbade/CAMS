import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { setUser } from "../../redux/features/userSlice";

export default function ProtectedRoutes({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const role = decodedToken?.role?.toLowerCase();

      if (!role) throw new Error("Invalid token");

      const res = await axios.post(
        `https://cams-qgq9.onrender.com/api/v1/${role}/getUserData`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        throw new Error("User fetch failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error in ProtectedRoutes:", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user && token) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [user, token]);

  // Redirect if not logged in
  if (!token || (!user && !isLoading)) {
    return <Navigate to="/login" />;
  }

  return children;
}
