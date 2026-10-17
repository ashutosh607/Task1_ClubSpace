import React from "react";
import { Outlet, Link } from "react-router-dom";
import SpaceBackground from "./SpaceBackground";
import { ArrowLeft, Orbit } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#090a0f] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Background space canvas with twinkling stars and shooting stars */}
      <SpaceBackground />

      {/* Top Navigation Bar: Back to Main Website */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all backdrop-blur-md shadow-lg group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
          <span className="flex items-center gap-2">
            <Orbit className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            Back to Website
          </span>
        </Link>
      </div>

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
