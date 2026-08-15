import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRegistrations } from "../../store/user-slice";
import { logoutUser } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { X, LogOut, User, Calendar, ShieldCheck, CheckCircle2, Inbox, LayoutDashboard, ArrowRight } from "lucide-react";

export default function UserProfileDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myRegistrations } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen && user?.email) {
      dispatch(fetchUserRegistrations(user.email));
    }
  }, [isOpen, user, dispatch]);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const handleAdminDashboard = () => {
    onClose();
    navigate("/admin/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0c0c10] border-l border-white/15 h-full flex flex-col justify-between p-6 sm:p-8 text-white shadow-2xl overflow-y-auto">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-sm">
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{user?.userName || "Campus Student"}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role & Navigation Shortcuts */}
          <div className="my-6 space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">ACCOUNT ROLE</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/10 border border-white/20 text-white">
                {user?.role || "user"}
              </span>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={handleAdminDashboard}
                className="w-full flex items-center justify-between bg-white text-black font-bold px-4 py-3 rounded-2xl text-xs shadow-lg hover:bg-zinc-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Admin Command Center
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* MY REGISTERED EVENTS HISTORY SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                MY EVENT HISTORY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                {myRegistrations.length} Joined
              </span>
            </div>

            {myRegistrations.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-xs space-y-2">
                <Inbox className="w-8 h-8 mx-auto stroke-1 text-zinc-600" />
                <p className="font-semibold text-white">No registrations yet</p>
                <p className="text-[11px] text-zinc-500">
                  Explore events on the home page and click "Register Now" to build your activity pass.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {myRegistrations.map((reg) => (
                  <div
                    key={reg._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        {reg.clubName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 border border-white/20 text-white">
                        {reg.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{reg.eventTitle}</h4>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/5">
                      <span>Applied: {reg.registrationDate}</span>
                      <span className="text-white font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-white" /> Pass Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Logout */}
        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 rounded-2xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </button>
        </div>

      </div>
    </div>
  );
}
