import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaUser,
  FaEnvelope,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaSync,
} from "react-icons/fa";
import { OrderService } from "../service/OrderService";
import { getImageUrl } from "../utils/imageUtils"; // adjust path if needed

const STATUS_OPTIONS = [
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

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("PENDING");

  const loadOrder = async () => {
    if (!token || !id) {
      setError("Missing token or order id");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prefer admin list then find (works even without a dedicated admin get-by-id API)
      const res = await OrderService.getAllOrders(token);
      const list = Array.isArray(res.data) ? res.data : [];
      const found = list.find(
        (o) => String(o.orderId) === String(id)
      );

      if (!found) {
        setError("Order not found");
        setOrder(null);
        return;
      }

      setOrder(found);
      setStatus(String(found.status || "PENDING").toUpperCase());
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    if (String(order.status).toUpperCase() === status) return;

    if (!window.confirm(`Update order #${order.orderId} to ${status}?`)) {
      return;
    }

    try {
      setSaving(true);
      const res = await OrderService.updateStatus(
        token,
        order.orderId,
        status
      );
      setOrder((prev) => ({
        ...prev,
        ...res.data,
        status,
      }));
      alert("Status updated");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const currentStatus = String(order?.status || status || "PENDING").toUpperCase();
  const badge = statusStyles[currentStatus] || statusStyles.PENDING;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#ff7a00] mb-6"
      >
        <FaArrowLeft /> Back to Orders
      </button>

      {loading ? (
        <p className="text-center py-20 text-slate-400">Loading order...</p>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            type="button"
            onClick={loadOrder}
            className="text-[#ff7a00] font-semibold"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Order #{order.orderId}
                  </h1>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}
                  >
                    {currentStatus}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Placed on {formatDate(order.orderDate)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white outline-none focus:border-[#ff7a00]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleUpdateStatus}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e56e00] text-white text-sm font-bold disabled:opacity-60"
                >
                  <FaSync className={saving ? "animate-spin" : ""} />
                  {saving ? "Saving..." : "Update status"}
                </button>
              </div>
            </div>
          </div>

          {/* Status steps */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs sm:text-sm">
              {[
                { key: "PENDING", label: "Pending", icon: FaBoxOpen },
                { key: "PAID", label: "Paid", icon: FaCreditCard },
                { key: "SHIPPED", label: "Shipped", icon: FaTruck },
                { key: "DELIVERED", label: "Delivered", icon: FaCheckCircle },
              ].map((step) => {
                const rank = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];
                const active =
                  currentStatus !== "CANCELLED" &&
                  rank.indexOf(step.key) <= rank.indexOf(currentStatus);
                const Icon = step.icon;
                return (
                  <div
                    key={step.key}
                    className={`rounded-xl border p-3 ${
                      active
                        ? "border-[#ff7a00] bg-orange-50 text-[#ff7a00]"
                        : "border-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="mx-auto mb-1 text-lg" />
                    <p className="font-semibold">{step.label}</p>
                  </div>
                );
              })}
            </div>
            {currentStatus === "CANCELLED" && (
              <p className="mt-3 text-sm text-red-600 font-medium">
                This order is cancelled.
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Order items</h2>
              <div className="divide-y divide-slate-100">
                {(order.items || []).length === 0 ? (
                  <p className="text-sm text-slate-500 py-6 text-center">
                    No items in this order
                  </p>
                ) : (
                  order.items.map((item) => (
                    <div
                      key={
                        item.orderItemId ||
                        `${item.productId}-${item.productName}`
                      }
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={getImageUrl?.(item.imageUrl) || item.imageUrl || "https://via.placeholder.com/56"}
                          alt={item.productName}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/56?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 line-clamp-2">
                          {item.productName || `Product #${item.productId}`}
                        </p>
                        <p className="text-sm text-slate-500">
                          Qty {item.quantity} × $
                          {Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900 shrink-0">
                        $
                        {Number(
                          item.lineTotal ??
                            Number(item.price || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Side panels */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4">Customer</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <FaUser className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">User ID</p>
                      <p className="font-medium text-slate-800">
                        {order.userId ?? "—"}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <FaEnvelope className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="font-medium text-slate-800 break-all">
                        {order.userEmail || order.email || "—"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4">Payment</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Method</span>
                    <span className="font-medium text-slate-900">
                      {order.paymentMethod || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Status</span>
                    <span className="font-medium text-slate-900">
                      {order.paymentStatus || "—"}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-[#ff7a00]">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admin/orders"
              className="flex-1 text-center border border-slate-200 hover:bg-white text-slate-700 font-semibold py-3 rounded-xl transition"
            >
              All orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}