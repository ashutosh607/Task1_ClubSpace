import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  // 1. Authenticated users trying to access auth pages (login/register)
  if (isAuthenticated && path.includes("/auth")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 2. Unauthenticated users trying to access admin routes
  if (!isAuthenticated && path.startsWith("/admin")) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3. Non-admin users trying to access admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    path.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
