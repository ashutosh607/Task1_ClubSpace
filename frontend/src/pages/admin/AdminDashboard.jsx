import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/auth-slice";
import {
  fetchAdminEvents,
  fetchAdminClubs,
  fetchAdminRegistrations,
  deleteAdminEvent,
  updateRegistrationStatus,
} from "../../store/admin-slice";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  LogOut,
  Plus,
  Search,
  Download,
  Trash2,
  Orbit,
  ShieldCheck,
  CheckCircle2,
  Inbox,
  Pencil,
  Globe,
} from "lucide-react";
import ThreeSpaceBackground from "../../components/common/ThreeSpaceBackground";
import AddEventDrawer from "../../components/admin/AddEventDrawer";
import AddClubDrawer from "../../components/admin/AddClubDrawer";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, clubs, registrations } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'events' | 'clubs' | 'registrations'
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isClubDrawerOpen, setIsClubDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  const [regSearch, setRegSearch] = useState("");
  const [regFilter, setRegFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAdminEvents());
    dispatch(fetchAdminClubs());
    dispatch(fetchAdminRegistrations());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteAdminEvent(id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateRegistrationStatus({ id, status: newStatus }));
  };

  const handleExportCSV = () => {
    if (!registrations.length) return;
    const headers = ["Student Name,Email,Event,Club,Date,Status\n"];
    const rows = registrations.map(
      (r) =>
        `"${r.studentName}","${r.email}","${r.eventTitle}","${r.clubName}","${r.registrationDate}","${r.status}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n"))], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clubspace_registrations.csv";
    a.click();
  };

  // Filtered Lists
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.club.toLowerCase().includes(eventSearch.toLowerCase());
    const matchesFilter =
      eventFilter === "All" ? true : e.status === eventFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.clubName.toLowerCase().includes(regSearch.toLowerCase());
    const matchesFilter = regFilter === "All" ? true : r.status === regFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white flex overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* 3D Three.js Interactive Monochromatic Space Background */}
      <ThreeSpaceBackground />

      {/* Slide-over Event Drawer */}
      <AddEventDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => { setIsEventDrawerOpen(false); setEditingEvent(null); }}
        onOpenAddClub={() => setIsClubDrawerOpen(true)}
        editEvent={editingEvent}
      />

      {/* Slide-over Club Drawer */}
      <AddClubDrawer
        isOpen={isClubDrawerOpen}
        onClose={() => setIsClubDrawerOpen(false)}
      />

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="relative z-20 w-64 md:w-72 bg-[#09090b]/95 border-r border-white/10 flex flex-col justify-between p-6 backdrop-blur-xl shrink-0">
        <div>
          {/* Header Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white">
              <Orbit className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-wider text-white">
                CLUBSPACE
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                ADMIN COMMAND CENTER
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "events"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Events
            </button>

            <button
              onClick={() => setActiveTab("clubs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "clubs"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Clubs
            </button>

            <button
              onClick={() => setActiveTab("registrations")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "registrations"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              Registrations
            </button>

            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20 transition-all duration-200 mt-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>View Live Website</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-sm">
              {user?.userName ? user.userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {user?.userName || "Admin User"}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT DISPLAY AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto">
        {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                  ADMIN DASHBOARD
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Overview of portal activity and system health.
                </p>
              </div>

              <button
                onClick={() => setIsEventDrawerOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                ADD EVENT
              </button>
            </div>

            {/* Top Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#121215]/90 border border-white/10 rounded-2xl p-5 space-card-glow backdrop-blur-md">
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                  <span className="text-xs font-medium">Total Events</span>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {events.length}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 font-medium">
                  Events added by admin
                </p>
              </div>

              <div className="bg-[#121215]/90 border border-white/10 rounded-2xl p-5 space-card-glow backdrop-blur-md">
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                  <span className="text-xs font-medium">Active Clubs</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {clubs.length}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 font-medium">
                  Registered campus clubs
                </p>
              </div>

              <div className="bg-[#121215]/90 border border-white/10 rounded-2xl p-5 space-card-glow backdrop-blur-md">
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                  <span className="text-xs font-medium">Registrations</span>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {registrations.length}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 font-medium">
                  Student event applications
                </p>
              </div>

              <div className="bg-[#121215]/90 border border-white/10 rounded-2xl p-5 space-card-glow backdrop-blur-md">
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                  <span className="text-xs font-medium">System Status</span>
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">Online</div>
                <p className="text-[11px] text-zinc-400 mt-1.5 font-medium">
                  MongoDB Atlas connected
                </p>
              </div>
            </div>

            {/* Dashboard Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Registrations Table */}
              <div className="lg:col-span-2 bg-[#121215]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">
                    Recent Registrations
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Latest student activity across events.
                  </p>
                </div>

                {registrations.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2">
                    <Inbox className="w-8 h-8 stroke-1 text-zinc-600" />
                    <p className="text-xs font-medium text-zinc-400">No registrations yet.</p>
                    <p className="text-[11px] text-zinc-600 max-w-xs">
                      Student registrations will appear here once users apply for events.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase">
                          <th className="py-3 px-3">NAME</th>
                          <th className="py-3 px-3">EVENT</th>
                          <th className="py-3 px-3">CLUB</th>
                          <th className="py-3 px-3">DATE</th>
                          <th className="py-3 px-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {registrations.slice(0, 5).map((reg) => (
                          <tr key={reg._id} className="hover:bg-white/5 transition-all">
                            <td className="py-3 px-3 font-semibold text-white">
                              {reg.studentName}
                            </td>
                            <td className="py-3 px-3 text-zinc-300">
                              {reg.eventTitle}
                            </td>
                            <td className="py-3 px-3 text-zinc-400">
                              {reg.clubName}
                            </td>
                            <td className="py-3 px-3 text-zinc-400">
                              {reg.registrationDate}
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white/10 border-white/20 text-white">
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Col: Upcoming Events List */}
              <div className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">
                    Published Events
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Quick access to scheduled activities.
                  </p>
                </div>

                {events.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2">
                    <Calendar className="w-8 h-8 stroke-1 text-zinc-600" />
                    <p className="text-xs font-medium text-zinc-400">No events created yet.</p>
                    <button
                      onClick={() => setIsEventDrawerOpen(true)}
                      className="mt-2 text-xs font-semibold text-white hover:underline"
                    >
                      + Add your first event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 4).map((evt) => (
                      <div
                        key={evt._id}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all flex items-center justify-between gap-3"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            {evt.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {evt.club} • {evt.date}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("events")}
                          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/20 transition-all uppercase"
                        >
                          VIEW
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EVENTS MANAGEMENT ================= */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                  EVENTS MANAGEMENT
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Create, edit, and manage campus events.
                </p>
              </div>

              <button
                onClick={() => setIsEventDrawerOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                CREATE EVENT
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121215]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["All", "Open", "Waitlist", "Closed", "Draft"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setEventFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      eventFilter === status
                        ? "bg-white text-black font-bold shadow-md"
                        : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-[#121215]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
              {filteredEvents.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 space-y-3">
                  <Calendar className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
                  <p className="text-sm font-semibold text-white">No events found</p>
                  <p className="text-xs text-zinc-500">
                    Click "+ CREATE EVENT" from top right to add your first event.
                  </p>
                  <button
                    onClick={() => setIsEventDrawerOpen(true)}
                    className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2 rounded-xl mt-2"
                  >
                    <Plus className="w-4 h-4" /> Create Event
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase">
                        <th className="py-4 px-4">EVENT NAME</th>
                        <th className="py-4 px-4">CLUB</th>
                        <th className="py-4 px-4">DATE & TIME</th>
                        <th className="py-4 px-4">VENUE</th>
                        <th className="py-4 px-4">REGISTRATIONS</th>
                        <th className="py-4 px-4">STATUS</th>
                        <th className="py-4 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredEvents.map((evt) => (
                        <tr key={evt._id} className="hover:bg-white/5 transition-all">
                          <td className="py-4 px-4 font-bold text-white">
                            {evt.title}
                          </td>
                          <td className="py-4 px-4 text-zinc-300">
                            {evt.club}
                          </td>
                          <td className="py-4 px-4 text-zinc-400">
                            {evt.date}
                          </td>
                          <td className="py-4 px-4 text-zinc-400">
                            {evt.venue}
                          </td>
                          <td className="py-4 px-4 font-semibold text-white">
                            {evt.registrationsCount} / {evt.capacity}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white/10 border-white/20 text-white">
                              {evt.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingEvent(evt); setIsEventDrawerOpen(true); }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all"
                                title="Edit Event"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt._id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 border border-white/10 transition-all"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredEvents.length > 0 && (
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span>
                    Showing {filteredEvents.length} of {events.length} events
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CLUBS DIRECTORY ================= */}
        {activeTab === "clubs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                  CAMPUS CLUBS
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage college clubs and student organizations.
                </p>
              </div>

              <button
                onClick={() => setIsClubDrawerOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                REGISTER CLUB
              </button>
            </div>

            {clubs.length === 0 ? (
              <div className="bg-[#121215]/90 border border-white/10 rounded-3xl p-12 text-center text-zinc-400 space-y-3 backdrop-blur-xl">
                <ShieldCheck className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
                <p className="text-sm font-semibold text-white">No clubs registered yet</p>
                <p className="text-xs text-zinc-500">
                  Click "+ REGISTER CLUB" to add your campus club.
                </p>
                <button
                  onClick={() => setIsClubDrawerOpen(true)}
                  className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2 rounded-xl mt-2"
                >
                  <Plus className="w-4 h-4" /> Register Club
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club) => (
                  <div
                    key={club._id}
                    className="bg-[#121215]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-card-glow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {club.logo ? (
                          <img
                            src={club.logo}
                            alt={club.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md bg-black shrink-0"
                          />
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 border border-white/20 text-white">
                            {club.category}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {club.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">
                        {club.name}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {club.description || "Active student organization in ClubSpace."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                      <div>
                        <p className="font-semibold text-white">{club.leadName}</p>
                        <p className="text-[10px] text-zinc-500">{club.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: REGISTRATIONS MANAGEMENT ================= */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-1">
                  ADMIN PANEL
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                  REGISTRATIONS
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  View and manage all student event registrations.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                disabled={registrations.length === 0}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                EXPORT CSV
              </button>
            </div>

            {/* Search & Filter Options */}
            <div className="bg-[#121215]/90 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by name, event, or club..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pt-1">
                {["All", "Open", "Waitlist", "Closed", "Cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setRegFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        regFilter === status
                          ? "bg-white text-black font-bold shadow-md"
                          : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#121215]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
              {filteredRegistrations.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
                  <p className="text-sm font-semibold text-white">No registrations found</p>
                  <p className="text-xs text-zinc-500">
                    Student registrations will be logged here when users sign up for events.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase">
                        <th className="py-4 px-4">STUDENT NAME</th>
                        <th className="py-4 px-4">EMAIL</th>
                        <th className="py-4 px-4">EVENT</th>
                        <th className="py-4 px-4">CLUB</th>
                        <th className="py-4 px-4">REGISTRATION DATE</th>
                        <th className="py-4 px-4">STATUS</th>
                        <th className="py-4 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRegistrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-white/5 transition-all">
                          <td className="py-4 px-4 font-bold text-white">
                            {reg.studentName}
                          </td>
                          <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">
                            {reg.email}
                          </td>
                          <td className="py-4 px-4 text-zinc-200 font-medium">
                            {reg.eventTitle}
                          </td>
                          <td className="py-4 px-4 text-zinc-400">
                            {reg.clubName}
                          </td>
                          <td className="py-4 px-4 text-zinc-400">
                            {reg.registrationDate}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold border bg-white/10 border-white/20 text-white">
                              {reg.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <select
                              value={reg.status}
                              onChange={(e) =>
                                handleStatusChange(reg._id, e.target.value)
                              }
                              className="bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-white/40"
                            >
                              <option value="Open">Open</option>
                              <option value="Waitlist">Waitlist</option>
                              <option value="Closed">Closed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
