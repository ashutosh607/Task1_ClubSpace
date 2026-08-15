import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAdminEvent, fetchAdminClubs } from "../../store/admin-slice";
import { fetchPublicClubs } from "../../store/user-slice";
import { X, Loader2, Orbit, Upload, Image, Trash2, AlertCircle } from "lucide-react";

const AddEventDrawer = ({ isOpen, onClose, onOpenAddClub }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Retrieve clubs from Redux store
  const { clubs: adminClubs } = useSelector((state) => state.admin || { clubs: [] });
  const { clubs: userClubs } = useSelector((state) => state.user || { clubs: [] });
  const clubs = adminClubs && adminClubs.length > 0 ? adminClubs : userClubs || [];

  const [formData, setFormData] = useState({
    title: "",
    club: "",
    category: "Technical",
    date: "",
    venue: "",
    capacity: 50,
    status: "Open",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAdminClubs());
      dispatch(fetchPublicClubs());
    }
  }, [isOpen, dispatch]);

  // When clubs are loaded, set default club if none selected
  useEffect(() => {
    if (clubs.length > 0 && !formData.club) {
      setFormData((prev) => ({
        ...prev,
        club: clubs[0].name,
        category: clubs[0].category || prev.category,
      }));
    }
  }, [clubs, formData.club]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "club") {
      const selectedClubObj = clubs.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        club: value,
        category: selectedClubObj?.category || prev.category,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle Event Photo Upload as Base64 Data URL
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.club || !formData.date || !formData.venue) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(addAdminEvent(formData)).unwrap();
      setLoading(false);
      setFormData({
        title: "",
        club: clubs[0]?.name || "",
        category: "Technical",
        date: "",
        venue: "",
        capacity: 50,
        status: "Open",
        description: "",
        image: "",
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
                    Publish a mission for a registered campus club.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If 0 clubs exist, show warning */}
            {clubs.length === 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center space-y-3 my-6">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-amber-200">No Registered Clubs Found</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Events can only be created for clubs that are currently active on the website. Please register a campus club first.
                </p>
                {onOpenAddClub && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddClub();
                    }}
                    className="inline-flex items-center gap-2 bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-300 transition-all cursor-pointer"
                  >
                    + Register a Club First
                  </button>
                )}
              </div>
            ) : (
              /* Event Creation Form */
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
                    placeholder="e.g. Starlight Open Mic / Hack Matrix"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>

                {/* Hosting Club Dropdown (Restricted to Registered Clubs Only) */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1 flex items-center justify-between">
                    <span>HOSTING CLUB (FROM REGISTERED CLUBS) *</span>
                    <span className="text-emerald-400 font-mono text-[9px]">
                      {clubs.length} Clubs Available
                    </span>
                  </label>
                  <select
                    name="club"
                    value={formData.club}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Select Hosting Club --
                    </option>
                    {clubs.map((c) => (
                      <option key={c._id || c.id || c.name} value={c.name}>
                        {c.name} ({c.category || "General"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Photo / Banner Upload */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                    EVENT PHOTO / BANNER
                  </label>
                  
                  {formData.image ? (
                    <div className="relative group/img w-full p-3 bg-[#18181b] border border-white/15 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.image}
                          alt="Event Banner Preview"
                          className="w-16 h-12 rounded-lg object-cover border border-white/20 shadow-md bg-black"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-white">Photo Uploaded</p>
                          <p className="text-[10px] text-zinc-400">Fits into event header card</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                        <Upload className="w-5 h-5 text-zinc-400" />
                        <span className="text-xs text-zinc-300 font-medium">Click to upload event photo</span>
                        <span className="text-[10px] text-zinc-500 font-mono">PNG, JPG, WEBP (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 uppercase">Or image URL:</span>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="https://example.com/banner.jpg"
                          className="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>
                  )}
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
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Academic">Academic</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Arts">Arts</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Science">Science</option>
                      <option value="Sports">Sports</option>
                      <option value="Debate">Debate</option>
                      <option value="Community">Community</option>
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
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
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
            )}
          </div>

          {/* Drawer Actions */}
          <div className="pt-6 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-event-form"
              disabled={loading || clubs.length === 0}
              className="flex-1 bg-white hover:bg-zinc-200 text-black font-semibold py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
