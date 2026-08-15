import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import SpaceBackground from "../../components/auth/SpaceBackground";

const UnauthPage = () => {
  return (
    <div className="relative min-h-screen bg-[#090a0f] text-white flex flex-col items-center justify-center p-4">
      <SpaceBackground />

      <div className="relative z-10 max-w-md w-full bg-[#0d0e15]/90 border border-red-500/20 rounded-3xl p-8 text-center space-card-glow backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">403 - Access Denied</h1>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          You don't have administrative clearance to access this area of ClubSpace.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-5 py-3 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Portal Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthPage;
