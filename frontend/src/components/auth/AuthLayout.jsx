import React from "react";
import { Outlet } from "react-router-dom";
import SpaceBackground from "./SpaceBackground";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#090a0f] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Background space canvas with twinkling stars and shooting stars */}
      <SpaceBackground />

      {/* Outer ambient glow ring */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />


      {/* Floating Card Container */}
      <div className="relative z-10 w-full max-w-md my-auto animate-space-float">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
