import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaSync,
  FaUserShield,
  FaUser,
  FaEye,
} from "react-icons/fa";
import { UserService } from "../service/UserService";

const roleStyles = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  CUSTOMER: "bg-sky-50 text-sky-700 border-sky-200",
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

export default function Users() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = async () => {
    if (!token) {
      setError("Please login as admin");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await UserService.getAllUsers(token);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const role = String(u.role || "").toUpperCase();
      if (roleFilter !== "ALL" && role !== roleFilter) return false;
      if (!q) return true;
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const id = String(u.userId || "");
      return name.includes(q) || email.includes(q) || id.includes(q);
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const admins = users.filter(
      (u) => String(u.role).toUpperCase() === "ADMIN"
    ).length;
    const customers = users.filter(
      (u) => String(u.role).toUpperCase() === "CUSTOMER"
    ).length;
    return { total: users.length, admins, customers };
  }, [users]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">
            All registered users — search and filter
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-[#ff7a00] hover:text-[#ff7a00]"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Admins</p>
          <p className="text-2xl font-extrabold text-purple-700">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Customers</p>
          <p className="text-2xl font-extrabold text-sky-700">{stats.customers}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, id..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#ff7a00]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-[#ff7a00]"
        >
          <option value="ALL">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-slate-400">Loading users...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const role = String(u.role || "CUSTOMER").toUpperCase();
                  const badge = roleStyles[role] || roleStyles.CUSTOMER;
                  return (
                    <tr key={u.userId} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        #{u.userId}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        <span className="inline-flex items-center gap-2">
                          {role === "ADMIN" ? (
                            <FaUserShield className="text-purple-500" />
                          ) : (
                            <FaUser className="text-sky-500" />
                          )}
                          {`${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                            "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {u.mobile || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}
                        >
                          {role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(u.createdOn || u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/users/${u.userId}`}
                          className="inline-flex items-center gap-1.5 text-[#ff7a00] font-semibold hover:underline"
                        >
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Showing {filtered.length} of {users.length} users
      </p>
    </div>
  );
}