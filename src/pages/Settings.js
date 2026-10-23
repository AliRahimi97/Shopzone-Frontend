import { useEffect, useState } from "react";
import {
  FaCog,
  FaKey,
  FaSun,
  FaMoon,
  FaShieldAlt,
  FaBell,
} from "react-icons/fa";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChangePassword = () => {
    setMessage("");

    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // TODO: call real API later (e.g. PUT /api/users/me/password)
    setMessage("Password updated (demo only — API not connected yet).");
    setPassword("");
    setConfirmPassword("");
  };

  const handleToggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FaCog className="text-[#ff7a00]" />
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Account preferences for the admin panel
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm border ${
            message.includes("demo") || message.includes("updated")
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Change password */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <FaKey className="text-[#ff7a00]" />
          <h2 className="text-lg font-bold text-slate-900">Change password</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Demo UI only — wire to backend when ready.
        </p>

        <div className="space-y-3">
          <input
            type="password"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff7a00] bg-slate-50"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff7a00] bg-slate-50"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleChangePassword}
            className="bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
          >
            Save new password
          </button>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-1">
          {theme === "light" ? (
            <FaSun className="text-amber-500" />
          ) : (
            <FaMoon className="text-indigo-500" />
          )}
          <h2 className="text-lg font-bold text-slate-900">Display mode</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Current theme:{" "}
          <span className="font-semibold text-slate-800 capitalize">
            {theme}
          </span>
        </p>
        <button
          type="button"
          onClick={handleToggleTheme}
          className="inline-flex items-center gap-2 border border-slate-200 hover:border-[#ff7a00] hover:text-[#ff7a00] text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
          {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        </button>
      </section>

      {/* Placeholders for later */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 opacity-80">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Coming later</h2>
        <ul className="space-y-3 text-sm text-slate-500">
          <li className="flex items-center gap-2">
            <FaBell className="text-slate-400" />
            Email / order notifications
          </li>
          <li className="flex items-center gap-2">
            <FaShieldAlt className="text-slate-400" />
            Two-factor authentication
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Settings;