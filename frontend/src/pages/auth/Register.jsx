import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../../store/auth-slice";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.email || !formData.password) return;

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      }
    });
  };

  return (
    <div className="w-full bg-[#0d0e15]/90 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-10 shadow-2xl space-card-glow text-white transition-all duration-300">
      {/* Top Header Identifier */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />

        </div>
        <span className="text-[11px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">
          CLUB EVENT PORTAL
        </span>
      </div>

      {/* Main Titles */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Create Account
        </h1>
        <p className="text-sm text-zinc-400">
          Join ClubSpace to explore campus events.
        </p>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
            FULL NAME
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="e.g. Alex Turner"
            required
            className="w-full bg-[#14151e]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
            EMAIL
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            required
            className="w-full bg-[#14151e]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-1.5">
            PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              className="w-full bg-[#14151e]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-200 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white hover:bg-zinc-200 active:scale-[0.99] text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>


      {/* Footer Switch */}
      <div className="mt-6 text-center text-xs text-zinc-400">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-white hover:underline transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
