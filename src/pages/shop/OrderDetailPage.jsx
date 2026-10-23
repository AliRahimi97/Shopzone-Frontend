import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { OrderService } from "../../service/OrderService";
import { parseJwt } from "../../utils/JwtUtils";
import Header from "./Header";
import Footer from "./Footer";
import { getImageUrl } from "../../utils/imageUtils";

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

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let userId = null;
      try {
        const decoded = parseJwt(token);
        const raw =
          decoded?.userId ?? decoded?.id ?? decoded?.user_id ?? decoded?.sub;
        userId = raw != null ? Number(raw) : null;
      } catch {
        userId = null;
      }

      if (!userId || !id) {
        setError("Unable to load order");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await OrderService.getOrder(token, userId, id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const status = (order?.status || "PENDING").toUpperCase();
  const badge = statusStyles[status] || statusStyles.PENDING;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#ff7a00] mb-6"
        >
          <FaArrowLeft /> Back to My Orders
        </button>

        {loading ? (
          <p className="text-center py-20 text-slate-400">Loading order...</p>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <Link to="/orders" className="text-[#ff7a00] font-semibold">
              Back to orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Order #{order.orderId}
                    </h1>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge}`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-2xl font-extrabold text-[#ff7a00]">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status timeline (simple) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Order status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs sm:text-sm">
                {[
                  { key: "PENDING", label: "Pending", icon: FaBoxOpen },
                  { key: "PAID", label: "Paid", icon: FaCreditCard },
                  { key: "SHIPPED", label: "Shipped", icon: FaTruck },
                  { key: "DELIVERED", label: "Delivered", icon: FaCheckCircle },
                ].map((step) => {
                  const orderRank = [
                    "PENDING",
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                  ].indexOf(status);
                  const stepRank = [
                    "PENDING",
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                  ].indexOf(step.key);
                  const active =
                    status !== "CANCELLED" && stepRank <= orderRank;
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
              {status === "CANCELLED" && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  This order was cancelled.
                </p>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Items</h2>
              <div className="divide-y divide-slate-100">
                {(order.items || []).map((item) => (
                  <div
                    key={item.orderItemId || `${item.productId}-${item.quantity}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <Link
                      to={item.productId ? `/products/${item.productId}` : "#"}
                      className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center"
                    >
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={item.productId ? `/products/${item.productId}` : "#"}
                        className="font-medium text-slate-900 hover:text-[#ff7a00] line-clamp-2"
                      >
                        {item.productName || `Product #${item.productId}`}
                      </Link>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Qty {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 shrink-0">
                      $
                      {Number(
                        item.lineTotal ?? (item.price || 0) * (item.quantity || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment summary */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Payment</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Payment method</span>
                  <span className="font-medium text-slate-900">
                    {order.paymentMethod || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment status</span>
                  <span className="font-medium text-slate-900">
                    {order.paymentStatus || "—"}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Order total</span>
                  <span className="text-[#ff7a00]">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/orders"
                className="flex-1 text-center border border-slate-200 hover:bg-white text-slate-700 font-semibold py-3 rounded-xl transition"
              >
                All Orders
              </Link>
              <Link
                to="/"
                className="flex-1 text-center bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold py-3 rounded-xl transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}