import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaUserShield,
  FaCalendarAlt,
  FaIdBadge,
} from "react-icons/fa";
import { UserService } from "../service/UserService";

const roleStyles = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  CUSTOMER: "bg-sky-50 text-sky-700 border-sky-200",
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token || !id) {
        setError("Missing token or user id");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const res = await UserService.getUserById(token, id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "User not found"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const role = String(user?.role || "CUSTOMER").toUpperCase();
  const badge = roleStyles[role] || roleStyles.CUSTOMER;
  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#ff7a00] mb-6"
      >
        <FaArrowLeft /> Back to Users
      </button>

      {loading ? (
        <p className="text-center py-20 text-slate-400">Loading user...</p>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Link to="/admin/users" className="text-[#ff7a00] font-semibold">
            Back to list
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-[#ff7a00] to-orange-400" />

          <div className="px-6 pb-8 -mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow flex items-center justify-center text-[#ff7a00]">
                {role === "ADMIN" ? (
                  <FaUserShield className="text-3xl" />
                ) : (
                  <FaUser className="text-3xl" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {fullName}
                  </h1>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}
                  >
                    {role}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Info
                icon={<FaIdBadge />}
                label="User ID"
                value={`#${user.userId}`}
              />
              <Info
                icon={<FaEnvelope />}
                label="Email"
                value={user.email || "—"}
              />
              <Info
                icon={<FaPhone />}
                label="Mobile"
                value={user.mobile || "Not set"}
              />
              <Info
                icon={<FaCalendarAlt />}
                label="Joined"
                value={formatDate(user.createdOn || user.createdAt)}
              />
              <Info
                icon={<FaUser />}
                label="First name"
                value={user.firstName || "—"}
              />
              <Info
                icon={<FaUser />}
                label="Last name"
                value={user.lastName || "—"}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex gap-3">
      <div className="text-[#ff7a00] mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="font-semibold text-slate-900 break-all">{value}</p>
      </div>
    </div>
  );
}