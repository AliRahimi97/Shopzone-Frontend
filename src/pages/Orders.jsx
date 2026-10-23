import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBoxOpen,
  FaSync,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { OrderService } from "../service/OrderService";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-slate-100 text-slate-700 border-slate-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
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

export default function Orders() {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    if (!token) {
      setError("Please login as admin");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await OrderService.getAllOrders(token);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const st = String(o.status || "").toUpperCase();
      if (statusFilter !== "ALL" && st !== statusFilter) return false;
      if (!q) return true;
      const id = String(o.orderId ?? "");
      const email = String(o.userEmail || o.email || "").toLowerCase();
      const name = String(o.userName || "").toLowerCase();
      return id.includes(q) || email.includes(q) || name.includes(q);
    });
  }, [orders, statusFilter, search]);

  const stats = useMemo(() => {
    const count = (s) =>
      orders.filter((o) => String(o.status).toUpperCase() === s).length;
    return {
      total: orders.length,
      pending: count("PENDING"),
      paid: count("PAID"),
      shipped: count("SHIPPED"),
      delivered: count("DELIVERED"),
      cancelled: count("CANCELLED"),
    };
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order #${orderId} to ${newStatus}?`)) return;
    try {
      setUpdatingId(orderId);
      const res = await OrderService.updateStatus(token, orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, ...res.data, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">
            Manage all customer orders
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-[#ff7a00] hover:text-[#ff7a00] transition"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-slate-900" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "Paid", value: stats.paid, color: "text-emerald-600" },
          { label: "Shipped", value: stats.shipped, color: "text-blue-600" },
          {
            label: "Delivered",
            value: stats.delivered,
            color: "text-slate-700",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            color: "text-red-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
          >
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by order ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#ff7a00]"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#ff7a00] bg-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-slate-400">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaBoxOpen className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const st = String(order.status || "PENDING").toUpperCase();
                  const badge = statusStyles[st] || statusStyles.PENDING;
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        #{order.orderId}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {order.userEmail ||
                          order.email ||
                          order.userName ||
                          `User #${order.userId || "—"}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {order.items?.length ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          disabled={updatingId === order.orderId}
                          value={st}
                          onChange={(e) =>
                            handleStatusChange(order.orderId, e.target.value)
                          }
                          className={`text-xs font-semibold px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${badge}`}
                        >
                          {STATUS_OPTIONS.filter((s) => s !== "ALL").map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/details/${order.orderId}`}
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
        Showing {filtered.length} of {orders.length} orders
      </p>
    </div>
  );
}