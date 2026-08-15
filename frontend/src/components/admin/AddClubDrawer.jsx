import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAdminClub } from "../../store/admin-slice";
import { X, ShieldCheck, Loader2, Upload, Image, Trash2 } from "lucide-react";

const AddClubDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Technical",
    leadName: "",
    email: "",
    description: "",
    logo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Logo Upload as Base64 Data URL
  const handleLogoUpload = (e) => {
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
        logo: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.leadName || !formData.email) return;

    setLoading(true);
    try {
      await dispatch(addAdminClub(formData)).unwrap();
      setLoading(false);
      setFormData({
        name: "",
        category: "Technical",
        leadName: "",
        email: "",
        description: "",
        logo: "",
      });
      onClose();
    } catch (err) {
      setLoading(false);
      alert(err || "Failed to register club");
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

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#09090b] border-l border-white/10 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-card-glow">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Register Campus Club
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Add a new club or student organization (Admin).
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

            <form id="add-club-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  CLUB NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Physics & Space Society"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              {/* Club Logo / Photo Upload */}
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  CLUB LOGO / PHOTO
                </label>
                
                {formData.logo ? (
                  <div className="relative group/logo w-full p-3 bg-[#18181b] border border-white/15 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.logo}
                        alt="Club Logo Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md bg-black"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-white">Logo Uploaded</p>
                        <p className="text-[10px] text-zinc-400">Fits into cards & 3D modals</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                      <Upload className="w-5 h-5 text-zinc-400" />
                      <span className="text-xs text-zinc-300 font-medium">Click to upload club logo</span>
                      <span className="text-[10px] text-zinc-500 font-mono">PNG, JPG, WEBP (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 uppercase">Or image URL:</span>
                      <input
                        type="url"
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  CATEGORY *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
                >
                  <option value="Technical">Technical</option>
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Arts">Arts</option>
                  <option value="Creative & Design">Creative & Design</option>
                  <option value="Sports">Sports</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  CLUB LEAD / HEAD NAME *
                </label>
                <input
                  type="text"
                  name="leadName"
                  value={formData.leadName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Turner"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1">
                  CONTACT EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="club@clubspace.edu"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
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
                  placeholder="Club mandate and activity scope..."
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>
            </form>
          </div>

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
              form="add-club-form"
              disabled={loading}
              className="flex-1 bg-white hover:bg-zinc-200 text-black font-semibold py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                "Register Club"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubDrawer;
