import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthUser } from "./store/auth-slice";

import CheckAuth from "./components/common/check-auth";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserHome from "./pages/user/UserHome";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UnauthPage from "./pages/unauth/UnauthPage";
import SpaceBackground from "./components/auth/SpaceBackground";
import { Loader2, Rocket } from "lucide-react";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-white">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
            <Rocket className="w-8 h-8 animate-bounce" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            Initializing Space Terminal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root check */}
      <Route
        path="/"
        element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
      />

      {/* Auth routes */}
      <Route
        path="/auth"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* User protected routes */}
      <Route
        path="/user/home"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <UserHome />
          </CheckAuth>
        }
      />

      {/* Admin protected routes */}
      <Route
        path="/admin/dashboard"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminDashboard />
          </CheckAuth>
        }
      />

      {/* Unauth page */}
      <Route path="/unauth-page" element={<UnauthPage />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;