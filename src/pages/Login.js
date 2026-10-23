import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { login } from "../api/AuthRequest";
import { AuthContext } from "../context/AuthContext";
import { parseJwt } from "../utils/JwtUtils";

const Login = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email.trim(), password);
      const token = data?.token || data?.accessToken;

      if (!token) {
        setError("Login failed: no token received.");
        return;
      }

      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth-changed"));
      if (typeof contextLogin === "function") {
        contextLogin(token);
      }

      const payload = parseJwt(token);
      const role = String(
        payload?.role || payload?.roles?.[0] || ""
      ).toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "CUSTOMER") {
        navigate("/", { replace: true });
      } else {
        // fallback: storefront
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel */}
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
            Welcome back
          </h1>
          <p className="text-white/90 text-lg max-w-md leading-relaxed">
            Sign in to manage your orders, track deliveries, or access the admin
            dashboard.
          </p>
        </div>
      </div>

      {/* Right form */}
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
              Sign in
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Enter your credentials to continue
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#ff7a00] focus:bg-white transition"
                    placeholder="you@example.com"
                    required
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#ff7a00] focus:bg-white transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff7a00] hover:bg-[#e56e00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-200/50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#ff7a00] hover:underline"
              >
                Create one
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

export default Login;