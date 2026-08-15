import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicClubs, fetchPublicEvents } from "../../store/user-slice";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
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
  ChevronDown,
  Globe2,
  Compass,
  Zap,
  Radio,
  Share2,
  Layers,
  ArrowUp,
} from "lucide-react";

import SpaceBackground from "../../components/auth/SpaceBackground";
import ClubGlobe from "../../components/user/ClubGlobe";
import RegistrationModal from "../../components/user/RegistrationModal";
import ClubDetailsModal from "../../components/user/ClubDetailsModal";
import UserProfileDrawer from "../../components/user/UserProfileDrawer";
import AddClubDrawer from "../../components/admin/AddClubDrawer";
import AddEventDrawer from "../../components/admin/AddEventDrawer";

// Category icon helper
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

  // Combine / prioritize live data
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
  const [clubSearch, setClubSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [eventTimeFilter, setEventTimeFilter] = useState("All");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("home");

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    dispatch(fetchPublicClubs());
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "clubs", "events", "about"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtered Clubs
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchesCategory =
        clubCategory === "All Clubs"
          ? true
          : c.category?.toLowerCase().includes(clubCategory.toLowerCase());

      const matchesSearch =
        c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(clubSearch.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [clubs, clubCategory, clubSearch]);

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Immersive Multi-Layer Cosmic Starfield Background */}
      <SpaceBackground />

      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-white via-cyan-400 to-white z-50 origin-left"
        style={{ scaleX }}
      />

      {/* ======================================================
          COSMIC HUD NAVIGATION BAR (Sticky Glassmorphic Dock)
      ====================================================== */}
      <header className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Orbital Beacon */}
          <div
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Orbit className="w-5 h-5 animate-spin-slow text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white">
                CLUB<span className="text-zinc-400">SPACE</span>
              </span>
              <span className="ml-2 text-[9px] uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Cosmic Portal
              </span>
            </div>
          </div>

          {/* Center Navigation Links with Active Scroll-Spy */}
          <nav className="hidden md:flex items-center gap-1 bg-black/60 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-md shadow-2xl">
            {[
              { id: "home", label: "Orbit Hub" },
              { id: "features", label: "Telemetry" },
              { id: "clubs", label: "Clubs Matrix" },
              { id: "events", label: "Missions & Events" },
              { id: "about", label: "Terminal Info" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollToSection(nav.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  activeNav === nav.id
                    ? "bg-white text-black font-bold shadow-lg shadow-white/20 scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <button
                onClick={() => setIsAddClubOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Club
              </button>
            )}

            <button
              onClick={() => setIsProfileOpen(true)}
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-1.5 pr-3.5 transition-all cursor-pointer shadow-lg"
              title="Open User Flight Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black font-bold flex items-center justify-center text-xs shadow-md">
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-semibold text-white group-hover:text-zinc-200">
                  {user?.userName || "Cadet"}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-zinc-500 font-mono">
                  {user?.role || "Student"}
                </span>
              </div>
            </button>
          </div>

        </div>
      </header>


      {/* ======================================================
          SECTION 1: HERO ORBIT & FULL-BLEED 3D SEAMLESS GLOBE
      ====================================================== */}
      <section id="home" className="relative min-h-[90vh] flex flex-col justify-between pt-12 pb-16 px-6 overflow-hidden">
        
        {/* Hero Headline & Telemetry Intro */}
        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-zinc-300 shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
            <span>CAMPUS MULTIVERSE ORBIT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]"
          >
            DISCOVER YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              CAMPUS CONSTELLATION.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Explore student organizations, track live missions, and connect with peer networks in an interactive 3D celestial workspace.
          </motion.p>

          {/* Quick Hero Telemetry Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => scrollToSection("clubs")}
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-6 py-3 rounded-full hover:bg-zinc-200 transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4" /> Explore Clubs Matrix
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-6 py-3 rounded-full transition-all backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Upcoming Missions
            </button>
          </motion.div>
        </div>

        {/* Seamless Full-Bleed 3D Globe Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative z-10 w-full max-w-6xl mx-auto my-4"
        >
          <ClubGlobe
            clubs={clubs}
            onSelectClub={(club) => setSelectedClub(club)}
            onAddClubClick={user?.role === "admin" ? () => setIsAddClubOpen(true) : null}
            selectedClubId={selectedClub?._id || selectedClub?.id}
          />
        </motion.div>

        {/* Scroll Into Orbit Guide Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-20 flex flex-col items-center justify-center gap-2 mt-4"
        >
          <button
            onClick={() => scrollToSection("features")}
            className="flex flex-col items-center gap-1 text-[11px] font-mono tracking-widest text-zinc-500 hover:text-white uppercase transition-colors cursor-pointer group"
          >
            <span>Scroll Into Orbit</span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-white/50 transition-colors">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
            </div>
          </button>
        </motion.div>

      </section>


      {/* ======================================================
          SECTION 2: TELEMETRY & ECOSYSTEM HIGHLIGHTS
      ====================================================== */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase inline-block"
          >
            ORBITAL CAPABILITIES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
          >
            A Unified Cosmic Flight-Deck
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto"
          >
            Built for universities to eliminate fragmented WhatsApp groups, missed deadlines, and lost tickets.
          </motion.p>
        </div>

        {/* 4 Staggered Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Globe2 className="w-6 h-6 text-white" />,
              title: "3D Spatial Mapping",
              desc: "Explore all student societies through dynamic 3D constellations that mirror active campus vitality.",
              tag: "Real-Time 3D",
            },
            {
              icon: <Zap className="w-6 h-6 text-white" />,
              title: "Zero-Friction RSVP",
              desc: "Instant 1-click registration for hackathons, guest lectures, and student galas with live pass tracking.",
              tag: "Instant Passes",
            },
            {
              icon: <Share2 className="w-6 h-6 text-white" />,
              title: "Inter-Club Sync",
              desc: "Seamless co-hosting for cross-department workshops, multi-club competitions, and symposiums.",
              tag: "Collab Mesh",
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-white" />,
              title: "Flight Deck Admin",
              desc: "Role-based management suite to dispatch announcements, inspect rosters, and monitor live metrics.",
              tag: "Verified Control",
            },
          ].map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#09090e]/90 hover:bg-[#12121a] border border-white/10 hover:border-white/30 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-card-glow"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors">
                <span>Explore system</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </section>


      {/* ======================================================
          SECTION 3: CAMPUS CLUBS CONSTELLATION
      ====================================================== */}
      <section id="clubs" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                STUDENT ORGANIZATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-1">
                Explore Clubs Matrix
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl">
                Browse official university clubs, technical societies, and cultural groups. Select any node to view history, leads, and events.
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => setIsAddClubOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-3 rounded-2xl shadow-lg hover:bg-zinc-200 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Register New Club
              </button>
            )}
          </div>

          {/* Search and Category Filter Toolbar */}
          <div className="bg-[#09090e]/80 border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-xl">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search clubs by name, keywords, or focus area..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    clubCategory === cat
                      ? "bg-white text-black font-bold shadow-lg shadow-white/20 scale-105"
                      : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          {filteredClubs.length === 0 ? (
            <div className="bg-[#09090e]/90 border border-white/10 rounded-3xl p-14 text-center text-zinc-400 space-y-4 backdrop-blur-xl">
              <Inbox className="w-12 h-12 mx-auto stroke-1 text-zinc-600" />
              <h3 className="text-base font-bold text-white">No Matching Clubs Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {user?.role === "admin"
                  ? "No clubs match your current search or category filter. Try clearing your filters or create a new organization node."
                  : "No campus clubs match your current filters. Organization nodes will appear once registered by campus administrators."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setClubCategory("All Clubs");
                    setClubSearch("");
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => setIsAddClubOpen(true)}
                    className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Register New Club
                  </button>
                )}
              </div>
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
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="group bg-[#09090e]/90 hover:bg-[#12121a] border border-white/10 hover:border-white/30 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      {/* Top Badges & Logo */}
                      <div className="flex items-center justify-between mb-4">
                        {club.logo ? (
                          <img
                            src={club.logo}
                            alt={club.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md bg-black/60 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-md shrink-0">
                            {getCategoryIcon(club.category)}
                          </div>
                        )}
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
                        <span className="text-zinc-400 font-medium">Upcoming Missions</span>
                        <span className="text-white font-bold">{clubEvtsCount}</span>
                      </div>

                      <button
                        onClick={() => setSelectedClub(club)}
                        className="w-full bg-white/5 group-hover:bg-white text-white group-hover:text-black border border-white/15 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        VIEW CLUB NODE <ArrowRight className="w-4 h-4" />
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
          SECTION 4: EVENT HORIZONS & MISSIONS CALENDAR
      ====================================================== */}
      <section id="events" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header & Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                MISSIONS & ACTIVITIES
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-1">
                Event Horizons
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl">
                Upcoming workshops, symposiums, hackathons, and cultural fests. Reserve your boarding pass in one click.
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-3 rounded-2xl shadow-lg hover:bg-zinc-200 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Dispatch New Event
              </button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#09090e]/80 border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search missions, hosts, topics, or venues..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {["All", "Today", "This Week", "This Month"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setEventTimeFilter(time)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      eventTimeFilter === time
                        ? "bg-white text-black font-bold shadow-md scale-105"
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
                  className="bg-[#121218] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-[#09090e]/90 border border-white/10 rounded-3xl p-14 text-center text-zinc-400 space-y-4 backdrop-blur-xl">
              <Calendar className="w-12 h-12 mx-auto stroke-1 text-zinc-600" />
              <h3 className="text-base font-bold text-white">No Active Missions Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {user?.role === "admin"
                  ? "No events currently match your filters. Check back soon or dispatch an event using the flight control desk."
                  : "No events match your current filters. Upcoming events and activities will appear here once published by administrators."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setEventTimeFilter("All");
                    setEventCategoryFilter("All");
                    setEventSearch("");
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => setIsAddEventOpen(true)}
                    className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-lg hover:bg-zinc-200 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create Campus Event
                  </button>
                )}
              </div>
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
                  className="group bg-[#09090e]/90 hover:bg-[#12121a] border border-white/10 hover:border-white/30 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Header Cosmic Banner / Photo */}
                    <div className="relative h-48 bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-black border-b border-white/10 p-5 flex flex-col justify-between overflow-hidden">
                      {evt.image && (
                        <>
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-[#09090e]/60 to-black/40" />
                        </>
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 border border-white/20 text-white backdrop-blur-md">
                          {evt.category || "General"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 uppercase tracking-wider backdrop-blur-md">
                          {evt.status || "Open"}
                        </span>
                      </div>
                      <div className="relative z-10 flex items-center gap-2 text-[11px] text-zinc-200 font-mono drop-shadow">
                        <Orbit className="w-3.5 h-3.5 text-zinc-300" />
                        <span>HOST: {evt.club}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-zinc-100 transition-colors">
                        {evt.title}
                      </h3>

                      <div className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-white/5 font-mono">
                        <p className="flex items-center gap-2">
                          <span>🗓</span> <strong>Date:</strong> {evt.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <span>📍</span> <strong>Venue:</strong> {evt.venue || "Campus Main Hall"}
                        </p>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 pt-2">
                        {evt.description || "Join this exciting student activity to connect and learn."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 py-3.5 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <span>RSVP & GET PASS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>

      </section>


      {/* ======================================================
          SECTION 5: CAMPUS TERMINAL & MISSION CTA
      ====================================================== */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              TERMINAL PROTOCOLS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Ready to Launch Your Organization?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              ClubSpace provides universities and student councils with an all-in-one ecosystem for discovery, real-time RSVP ticket generation, verified attendance tracking, and cross-campus coordination.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#09090e]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-white">{clubs.length}+</span>
                <span className="text-xs text-zinc-400">Campus Nodes Active</span>
              </div>
              <div className="bg-[#09090e]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-white">{events.length}+</span>
                <span className="text-xs text-zinc-400">Upcoming Missions</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-[#09090e]/95 border border-white/15 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase">Dispatch Control Hub</h3>
                <p className="text-xs text-zinc-400">University System Telemetry</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Matrix Status:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> OPERATIONAL
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Spatial 3D Engine:</span>
                <span className="text-white font-mono font-semibold">WebGL 2.0 Active</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Pass Encryption:</span>
                <span className="text-white font-mono font-semibold">256-bit Verified</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> View My Flight Log & Registrations
            </button>
          </motion.div>

        </div>

      </section>


      {/* ======================================================
          SECTION 6: FUTURISTIC COSMIC FOOTER
      ====================================================== */}
      <footer className="relative z-10 border-t border-white/10 bg-[#030305] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-zinc-500">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold">
              <Orbit className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wider">
                CLUBSPACE <span className="text-zinc-500 font-normal">TERMINAL</span>
              </span>
              <p className="text-[10px] text-zinc-600">Deep Space University Operating System</p>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <button onClick={() => scrollToSection("home")} className="hover:text-white transition-colors cursor-pointer">
              Orbit
            </button>
            <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">
              Telemetry
            </button>
            <button onClick={() => scrollToSection("clubs")} className="hover:text-white transition-colors cursor-pointer">
              Clubs
            </button>
            <button onClick={() => scrollToSection("events")} className="hover:text-white transition-colors cursor-pointer">
              Events
            </button>
            <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors cursor-pointer">
              Terminal
            </button>
          </div>

          <p className="text-center md:text-right text-[11px]">
            © {new Date().getFullYear()} ClubSpace. All orbital systems running.
          </p>
        </div>
      </footer>


      {/* ======================================================
          MODALS & DRAWERS
      ====================================================== */}
      
      {/* 1. Registration Modal */}
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

      {/* 2. Club Details Modal */}
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
