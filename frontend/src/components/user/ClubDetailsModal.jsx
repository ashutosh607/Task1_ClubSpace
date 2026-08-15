import React from "react";
import { X, Calendar, MapPin, Mail, Globe, Users, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ClubDetailsModal({ club, events = [], onClose, onSelectEvent }) {
  if (!club) return null;

  // Filter events belonging to this club
  const clubEvents = events.filter(
    (e) => e.club && e.club.toLowerCase() === club.name.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0d0d11] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT PANEL: CLUB OVERVIEW & METADATA (7 Cols - Matching Photo 4) */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10 space-y-6">
            
            {/* Club Identity Header */}
            <div className="flex items-start gap-4">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0 shadow-lg bg-black/50"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-lg">
                  {club.name ? club.name.charAt(0).toUpperCase() : "C"}
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                  {club.category || "CAMPUS ORGANIZATION"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  {club.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" /> Verified Campus Community
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {club.description ||
                "A community for students who explore innovative ideas, practical workshops, and campus activities through talks, hands-on sessions, and collaborative discovery."}
            </p>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {club.email || "club@clubspace.edu"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                clubspace.edu/{club.name ? club.name.toLowerCase().replace(/\s+/g, "") : "club"}
              </span>
            </div>

            {/* 3 Key Stats Grid Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">MEMBERS</p>
                <p className="text-2xl font-black text-white mt-1">24+</p>
                <p className="text-[10px] text-zinc-400 mt-1">Active volunteers</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">EVENTS</p>
                <p className="text-2xl font-black text-white mt-1">{clubEvents.length}</p>
                <p className="text-[10px] text-zinc-400 mt-1">Scheduled events</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">LOCATION</p>
                <p className="text-lg font-black text-white mt-1 truncate">Campus Center</p>
                <p className="text-[10px] text-zinc-400 mt-1">Innovation block</p>
              </div>
            </div>

            {/* Leadership Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                CLUB LEADERSHIP
              </span>
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="font-bold text-white">{club.leadName || "Student Convener"}</p>
                  <p className="text-[10px] text-zinc-400">Club President / Lead</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: UPCOMING EVENTS & PARTICIPATION GUIDELINES (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#09090c] space-y-6 flex flex-col justify-between">
            
            {/* Upcoming Events for this Club */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                  UPCOMING EVENTS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                  {clubEvents.length} events
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">Next on the calendar</h3>

              {clubEvents.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-zinc-400 text-xs space-y-1">
                  <p className="font-semibold text-white">No active events for this club</p>
                  <p className="text-[11px] text-zinc-500">
                    Events will appear here as soon as published by the lead.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clubEvents.map((evt) => (
                    <div
                      key={evt._id}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{evt.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {evt.date} • {evt.venue}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          if (onSelectEvent) onSelectEvent(evt);
                        }}
                        className="bg-white hover:bg-zinc-200 text-black text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                      >
                        VIEW EVENT
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to Participate Guidelines */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                REGISTRATION INFORMATION
              </span>
              <h4 className="text-xs font-bold text-white">How to join and participate</h4>
              <ul className="text-[11px] text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
                <li>No prior experience required for general membership.</li>
                <li>Workshop seats are limited and filled on a first-come basis.</li>
                <li>Volunteer roles are assigned after open onboarding sessions.</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
