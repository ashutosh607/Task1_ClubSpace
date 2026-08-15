import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserForEvent } from "../../store/user-slice";
import { X, CheckCircle2, Calendar, MapPin, Clock, Users, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isRegistering } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    studentName: user?.userName || "",
    email: user?.email || "",
    phone: "",
    collegeId: "",
    year: "1st Year",
    department: "Computer Science",
    answers: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.studentName || !formData.email || !formData.phone || !formData.collegeId) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    const payload = {
      studentName: formData.studentName,
      email: formData.email,
      eventTitle: event.title,
      clubName: event.club,
      eventId: event._id,
      phone: formData.phone,
      collegeId: formData.collegeId,
      year: formData.year,
      department: formData.department,
      answers: formData.answers,
    };

    const result = await dispatch(registerUserForEvent(payload));
    if (registerUserForEvent.fulfilled.match(result)) {
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.payload || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0d0d11] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-white">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          /* ================= MAIN 2-COLUMN REGISTRATION FORM ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* LEFT SIDE: EVENT DETAILS & METADATA (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-6">
              <div>
                {/* Event Hero Header / Image Placeholder */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-black border border-white/10 mb-6 flex items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black" />
                  <div className="relative z-10 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-300">
                      {event.category || "CAMPUS EVENT"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      Hosted by {event.club}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    CAMPUS EVENTS — LIVE REGISTRATION
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {event.title}
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {event.description ||
                      "Join us for an exciting campus event filled with hands-on learning, networking, and collaborative activities with student leaders."}
                  </p>
                </div>

                {/* 6 Key-Value Grid Cards (Matching Reference Photo 3) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">CLUB</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">{event.club}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">DATE</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">{event.date}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">TIME</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">7:30 PM</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">VENUE</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">{event.venue}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">CAPACITY</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">{event.capacity} Seats</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase">STATUS</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">{event.status}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                <span>SECURE CAMPUS REGISTRATION</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Confirmation Pass
                </span>
              </div>
            </div>

            {/* RIGHT SIDE: REGISTRATION FORM (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#09090c] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    REGISTRATION
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 border border-white/20 text-white">
                    {event.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-6">
                  Reserve your seat
                </h3>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full bg-[#141419] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#141419] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                        PHONE *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 555 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#141419] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                        COLLEGE ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ID-2026-001"
                        value={formData.collegeId}
                        onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                        className="w-full bg-[#141419] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                        YEAR
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-[#141419] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="PostGrad">PostGrad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                        DEPARTMENT
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[#141419] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Design">Design</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
                      ADDITIONAL DETAILS / QUESTIONS
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Share a few lines about your interest..."
                      value={formData.answers}
                      onChange={(e) => setFormData({ ...formData, answers: e.target.value })}
                      className="w-full bg-[#141419] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Processing...
                      </>
                    ) : (
                      <>
                        REGISTER NOW <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* ================= SUCCESS CONFIRMATION PASS VIEW (Matching Reference Photo 3) ================= */
          <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                You're registered.
              </h2>
              <p className="text-xs text-zinc-400">
                A confirmation record has been logged for your campus pass.
              </p>
            </div>

            {/* Registration Summary Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                EVENT SUMMARY
              </span>
              <div className="flex justify-between items-center text-xs py-1 border-b border-white/10">
                <span className="text-zinc-400 font-medium">Event Name</span>
                <span className="text-white font-bold">{event.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-white/10">
                <span className="text-zinc-400 font-medium">Host Club</span>
                <span className="text-white font-bold">{event.club}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-white/10">
                <span className="text-zinc-400 font-medium">Student Name</span>
                <span className="text-white font-bold">{formData.studentName}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-zinc-400 font-medium">Date & Venue</span>
                <span className="text-white font-bold">{event.date} • {event.venue}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg"
            >
              BACK TO EVENTS
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
