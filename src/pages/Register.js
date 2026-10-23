import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { customerRegister } from "../api/AuthRequest";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const contextLogin = auth?.login;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, mobile, password, confirmPassword } =
      formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
      };

      const data = await customerRegister(payload);
      const token = data?.token || data?.accessToken || data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        if (typeof contextLogin === "function") {
          contextLogin(token);
        }
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#ff7a00] focus:bg-white transition";

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#ff7a00] via-orange-500 to-amber-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#ff7a00] flex items-center justify-center text-xl font-black">
              S
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight">ShopZone</p>
              <p className="text-white/80 text-sm">Smart shopping for you</p>
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-4">
            Create your account
          </h1>
          <p className="text-white/90 text-lg max-w-md leading-relaxed">
            Join ShopZone to track orders, save your cart, and checkout faster.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#ff7a00] text-white flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              ShopZone
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
              Sign up
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Create a customer account
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    First name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Last name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mobile
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${fieldClass} pr-11`}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#ff7a00] hover:bg-[#e56e00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-200/50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#ff7a00] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-[#ff7a00]">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;