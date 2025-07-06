import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { setUser } from "../../redux/features/userSlice";

export default function ProtectedRoutes({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "https://cams-qgq9.onrender.com/api/v1/user/getUserData",
        { token },
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
        <Navigate to="/login" />;
        localStorage.clear();
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  };

  useEffect(() => {
    if (!user && token) {
      getUser();
    }
  }, [user, token, dispatch]);

  // Check token presence before rendering children
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
