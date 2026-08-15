import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { LogOut, Rocket, Sparkles, Calendar, Users, Award, Inbox } from "lucide-react";
import SpaceBackground from "../../components/auth/SpaceBackground";

const UserHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-white/20 selection:text-white">
      <SpaceBackground />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-white">
              CLUB<span className="text-zinc-400">SPACE</span>
            </span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              Student Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.userName}</p>
            <p className="text-xs text-zinc-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Content Body */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-6 md:p-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 space-card-glow backdrop-blur-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Welcome back, {user?.userName}!
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Explore Campus Clubs & Upcoming Events
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Stay updated with your campus activities, register for workshops, hackathons, and cultural fests.
            </p>
          </div>
        </div>

        {/* Available Events Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Campus Events
          </h2>

          {events.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-zinc-400 space-y-2 backdrop-blur-xl">
              <Inbox className="w-8 h-8 mx-auto stroke-1 text-zinc-600" />
              <p className="text-sm font-semibold text-white">No active events posted</p>
              <p className="text-xs text-zinc-500">
                New events will show up here once published by college admins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div
                  key={evt._id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-card-glow flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 border border-white/20 text-white">
                      {evt.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-3 mb-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-2">
                      Hosted by {evt.club}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {evt.date} • {evt.venue}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Seats: {evt.capacity}
                    </span>
                    <button className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-xl transition-all">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserHome;
