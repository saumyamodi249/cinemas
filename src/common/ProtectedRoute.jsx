import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard component that protects authenticated pages.
 * If accessToken is missing from localStorage, redirects user to login ("/").
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
