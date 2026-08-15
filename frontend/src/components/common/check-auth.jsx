import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  // Root redirect
  if (path === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/home" replace />;
    }
  }

  // 1. Unauthenticated users trying to access protected routes
  if (!isAuthenticated && !path.includes("/auth")) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Authenticated users trying to access auth pages (login/register)
  if (isAuthenticated && path.includes("/auth")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/home" replace />;
    }
  }

  // 3. Non-admin users trying to access admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    path.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  // 4. Admin users trying to access general user routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    path.startsWith("/user")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
