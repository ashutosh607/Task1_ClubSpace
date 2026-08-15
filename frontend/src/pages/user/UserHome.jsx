import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicClubs, fetchPublicEvents } from "../../store/user-slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  Sparkles,
  Calendar,
  Users,
  Search,
  Plus,
  User,
  ArrowRight,
  Filter,
  CheckCircle2,
  Inbox,
  ShieldCheck,
  Code,
  Laptop,
  Palette,
  Trophy,
  BookOpen,
} from "lucide-react";

import ClubGlobe from "../../components/user/ClubGlobe";
import RegistrationModal from "../../components/user/RegistrationModal";
import ClubDetailsModal from "../../components/user/ClubDetailsModal";
import UserProfileDrawer from "../../components/user/UserProfileDrawer";
import AddClubDrawer from "../../components/admin/AddClubDrawer";
import AddEventDrawer from "../../components/admin/AddEventDrawer";

// Icon mapper for categories
const getCategoryIcon = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("tech") || cat.includes("code")) return <Code className="w-5 h-5" />;
  if (cat.includes("art") || cat.includes("creative") || cat.includes("design"))
    return <Palette className="w-5 h-5" />;
  if (cat.includes("sport") || cat.includes("fit")) return <Trophy className="w-5 h-5" />;
  if (cat.includes("academic") || cat.includes("science")) return <BookOpen className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};

export default function UserHome() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { clubs: userClubs, events: userEvents, isLoading } = useSelector(
    (state) => state.user
  );
  const { clubs: adminClubs, events: adminEvents } = useSelector(
    (state) => state.admin
  );

  // Combine or prioritize live fetched data
  const clubs = useMemo(() => {
    return userClubs.length > 0 ? userClubs : adminClubs || [];
  }, [userClubs, adminClubs]);

  const events = useMemo(() => {
    return userEvents.length > 0 ? userEvents : adminEvents || [];
  }, [userEvents, adminEvents]);

  // Modal / Drawer state
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddClubOpen, setIsAddClubOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Filter States
  const [clubCategory, setClubCategory] = useState("All Clubs");
  const [eventSearch, setEventSearch] = useState("");
  const [eventTimeFilter, setEventTimeFilter] = useState("All");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchPublicClubs());
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  // Filtered Clubs
  const filteredClubs = useMemo(() => {
    if (clubCategory === "All Clubs") return clubs;
    return clubs.filter((c) =>
      c.category?.toLowerCase().includes(clubCategory.toLowerCase())
    );
  }, [clubs, clubCategory]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        e.club.toLowerCase().includes(eventSearch.toLowerCase()) ||
        (e.venue && e.venue.toLowerCase().includes(eventSearch.toLowerCase()));

      const matchesCat =
        eventCategoryFilter === "All"
          ? true
          : e.category?.toLowerCase() === eventCategoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [events, eventSearch, eventCategoryFilter]);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      
      {/* Background Star Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-[140px] rounded-full" />
      </div>

      {/* ======================================================
          TOP NAVIGATION HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Top Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-lg">
              <Orbit className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                CLUB<span className="text-zinc-400">SPACE</span>
              </span>
              <span className="ml-2 text-[10px] uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Campus Portal
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Matching Reference Photos 1 & 2) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <a
              href="#home"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 transition-all"
            >
              Home
            </a>
            <a
              href="#events"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              Events
            </a>
            <a
              href="#clubs"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              Clubs
            </a>
            <a
              href="#about"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              About
            </a>
          </nav>

          {/* Top Right: User Profile Avatar */}
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <button
                onClick={() => setIsAddClubOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Club
              </button>
            )}

            <button
              onClick={() => setIsProfileOpen(true)}
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-1.5 pr-3 transition-all cursor-pointer"
              title="Open User Profile & History"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black font-bold flex items-center justify-center text-xs">
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-xs font-semibold text-white group-hover:text-zinc-200 hidden sm:inline-block">
                {user?.userName || "Account"}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================
          MAIN HERO & 3D GLOBE SECTION
      ====================================================== */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-bold tracking-[0.25em] text-zinc-300 uppercase backdrop-blur-md">
            CAMPUS ECOSYSTEM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight">
            DISCOVER YOUR <span className="text-zinc-400">COMMUNITY.</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Explore student communities, upcoming activities, and the clubs shaping campus life in a quiet, premium space environment.
          </p>
        </motion.div>

        {/* 3D Monochromatic Interactive Globe Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ClubGlobe
            clubs={clubs}
            onSelectClub={(club) => setSelectedClub(club)}
            onAddClubClick={() => setIsAddClubOpen(true)}
          />
        </motion.div>
      </section>


      {/* ======================================================
          EXPLORE CLUBS GRID SECTION (Matching Reference Photo 1)
      ====================================================== */}
      <section id="clubs" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
              CAMPUS ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mt-1">
              EXPLORE CLUBS
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Discover student communities, upcoming activities, and the clubs shaping campus life in a quiet, premium space environment.
            </p>
          </div>

          {/* Category Filter Pills (Matching Reference Photo 1) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              "All Clubs",
              "Academic",
              "Arts",
              "Technology",
              "Sports",
              "Community",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setClubCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  clubCategory === cat
                    ? "bg-white text-black font-bold shadow-lg"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic Clubs Grid */}
          {filteredClubs.length === 0 ? (
            <div className="bg-[#0b0b0e] border border-white/10 rounded-3xl p-12 text-center text-zinc-400 space-y-3 backdrop-blur-xl">
              <Inbox className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
              <p className="text-sm font-semibold text-white">No campus clubs listed yet</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Once a club form is submitted, it will automatically populate here and onto the 3D globe.
              </p>
              <button
                onClick={() => setIsAddClubOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl mt-2 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Register Campus Club
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club, index) => {
                const clubEvtsCount = events.filter(
                  (e) => e.club && e.club.toLowerCase() === club.name.toLowerCase()
                ).length;

                return (
                  <motion.div
                    key={club._id || club.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group bg-[#0b0b0e] hover:bg-[#111116] border border-white/10 hover:border-white/25 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                          {getCategoryIcon(club.category)}
                        </div>
                        <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.15em] bg-white/5 border border-white/10 text-zinc-300 uppercase">
                          {club.category || "GENERAL"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                        {club.name}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                        {club.description ||
                          "A vibrant student organization dedicated to workshops, events, and campus project collaboration."}
                      </p>
                    </div>

                    <div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs mb-4">
                        <span className="text-zinc-400 font-medium">Upcoming Events</span>
                        <span className="text-white font-bold">{clubEvtsCount}</span>
                      </div>

                      <button
                        onClick={() => setSelectedClub(club)}
                        className="w-full bg-white/5 group-hover:bg-white text-white group-hover:text-black border border-white/15 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-2"
                      >
                        VIEW CLUB <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </section>


      {/* ======================================================
          UPCOMING EVENTS GRID SECTION (Matching Reference Photo 2)
      ====================================================== */}
      <section id="events" className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                UPCOMING EVENTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mt-1">
                FIND SOMETHING WORTH SHOWING UP FOR.
              </h2>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg hover:bg-zinc-200 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Create Campus Event
              </button>
            )}
          </div>

          {/* Search & Time Filter Control Bar (Matching Reference Photo 2) */}
          <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search events, clubs, speakers, or locations..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full bg-[#141419] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto">
                {["All", "Today", "This Week", "This Month"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setEventTimeFilter(time)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      eventTimeFilter === time
                        ? "bg-white text-black font-bold shadow-md"
                        : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={eventCategoryFilter}
                  onChange={(e) => setEventCategoryFilter(e.target.value)}
                  className="bg-[#141419] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Events Cards Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-[#0b0b0e] border border-white/10 rounded-3xl p-12 text-center text-zinc-400 space-y-3 backdrop-blur-xl">
              <Calendar className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
              <p className="text-sm font-semibold text-white">No active events found</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Events created via the form will automatically populate here.
              </p>
              {user?.role === "admin" && (
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl mt-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Create Campus Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt, index) => (
                <motion.div
                  key={evt._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group bg-[#0b0b0e] hover:bg-[#111116] border border-white/10 hover:border-white/25 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Dark Banner Image / Header Placeholder */}
                    <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-black border-b border-white/10 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 border border-white/20 text-white">
                          {evt.category || "General"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 border border-white/30 text-white uppercase">
                          {evt.status || "Open"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-zinc-100 transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-400">
                        {evt.club}
                      </p>

                      <div className="text-xs text-zinc-400 space-y-1 pt-2 border-t border-white/5 font-mono">
                        <p>🗓 {evt.date}</p>
                        <p>📍 {evt.venue}</p>
                      </div>

                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 pt-2">
                        {evt.description || "Join this event for workshops and student activities."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-2"
                    >
                      VIEW EVENT & REGISTER
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>

      </section>

      {/* ======================================================
          FOOTER ABOUT SECTION
      ====================================================== */}
      <footer id="about" className="relative z-10 border-t border-white/10 bg-[#050507] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold">
              <Orbit className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wider">
              CLUBSPACE <span className="text-zinc-500 font-normal">© 2026</span>
            </span>
          </div>

          <p className="text-center md:text-right">
            Quiet, premium space campus ecosystem built for student communities.
          </p>
        </div>
      </footer>


      {/* ======================================================
          MODALS & DRAWERS
      ====================================================== */}
      
      {/* 1. Registration Modal (Matching Photo 3) */}
      <AnimatePresence>
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onSuccess={() => {
              dispatch(fetchPublicEvents());
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. Club Details Modal (Matching Photo 4) */}
      <AnimatePresence>
        {selectedClub && (
          <ClubDetailsModal
            club={selectedClub}
            events={events}
            onClose={() => setSelectedClub(null)}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        )}
      </AnimatePresence>

      {/* 3. User Profile & Registration History Drawer */}
      <UserProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* 4. Admin Add Club Drawer */}
      <AddClubDrawer
        isOpen={isAddClubOpen}
        onClose={() => {
          setIsAddClubOpen(false);
          dispatch(fetchPublicClubs());
        }}
      />

      {/* 5. Admin Add Event Drawer */}
      <AddEventDrawer
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          dispatch(fetchPublicEvents());
        }}
      />

    </div>
  );
}
