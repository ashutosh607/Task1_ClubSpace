import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAdminEvent } from "../../store/admin-slice";
import { X, Loader2, Orbit } from "lucide-react";

const AddEventDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    club: "",
    category: "Technical",
    date: "",
    venue: "",
    capacity: 50,
    status: "Open",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.club || !formData.date || !formData.venue) return;

    setLoading(true);
    try {
      await dispatch(addAdminEvent(formData)).unwrap();
      setLoading(false);
      setFormData({
        title: "",
        club: "",
        category: "Technical",
        date: "",
        venue: "",
        capacity: 50,
        status: "Open",
        description: "",
      });
      onClose();
    } catch (err) {
      setLoading(false);
      alert(err || "Failed to create event");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#09090b] border-l border-white/10 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-card-glow">
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
                  <Orbit className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Create New Event
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Publish an event to the campus portal.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Creation Form */}
            <form id="add-event-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  EVENT TITLE *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Starlight Open Mic"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  HOSTING CLUB *
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science Society"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 transition-all"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Science">Science</option>
                    <option value="Sports">Sports</option>
                    <option value="Debate">Debate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                    CAPACITY
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  DATE & TIME *
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. Fri, Oct 18 - 7:00 PM"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  VENUE / LOCATION *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Blackbox Theater / Innovation Lab"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  REGISTRATION STATUS
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 transition-all"
                >
                  <option value="Open">Open</option>
                  <option value="Waitlist">Waitlist</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief summary of event details..."
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Drawer Actions */}
          <div className="pt-6 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-event-form"
              disabled={loading}
              className="flex-1 bg-white hover:bg-zinc-200 text-black font-semibold py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                "Publish Event"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventDrawer;
