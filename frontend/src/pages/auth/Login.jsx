import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../../store/auth-slice";
import { Eye, EyeOff, Loader2, Orbit } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
    if (!formData.email || !formData.password) return;

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        const role = data.payload.user?.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-zinc-400">
          Sign in to continue exploring campus events.
        </p>
      </div>

      {/* Error Message display */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-shake">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-2">
            EMAIL
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            required
            className="w-full bg-[#14151e]/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-2">
            PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full bg-[#14151e]/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-200 pr-10"
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

        {/* Forgot password link */}
        <div className="flex justify-end pt-1">
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert("Password reset functionality will be available in settings.");
            }}
            className="text-xs text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white hover:bg-zinc-200 active:scale-[0.99] text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="mt-8 text-center text-xs text-zinc-400">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-white hover:underline transition-all"
        >
          Create account
        </Link>
      </div>
    </div>
  );
};

export default Login;
