import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChevronRight,
  FaShoppingBag,
  FaArrowLeft,
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
    return value;
  }
}

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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

      if (!userId) {
        setError("Please login again");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await OrderService.getMyOrders(token, userId);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition"
          >
            <FaArrowLeft className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              My Orders
            </h1>
            <p className="text-sm text-slate-500">
              Track and review your past purchases
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-slate-400">Loading orders...</p>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <Link to="/" className="text-[#ff7a00] font-semibold">
              Back to Home
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
              <FaShoppingBag className="text-3xl text-[#ff7a00]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No orders yet
            </h2>
            <p className="text-slate-500 mb-6">
              When you place an order, it will show up here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = (order.status || "PENDING").toUpperCase();
              const badge =
                statusStyles[status] || statusStyles.PENDING;
              const firstItem = order.items?.[0];

              return (
                <Link
                  key={order.orderId}
                  to={`/orders/${order.orderId}`}
                  className="block bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Preview image */}
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {firstItem?.imageUrl ? (
                        <img
                          src={getImageUrl(firstItem.imageUrl)}
                          alt=""
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <FaBoxOpen className="text-slate-300 text-xl" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">
                          Order #{order.orderId}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {formatDate(order.orderDate)}
                        {order.items?.length
                          ? ` · ${order.items.length} item${
                              order.items.length > 1 ? "s" : ""
                            }`
                          : ""}
                      </p>
                      {firstItem?.productName && (
                        <p className="text-sm text-slate-700 mt-1 truncate">
                          {firstItem.productName}
                          {order.items.length > 1
                            ? ` +${order.items.length - 1} more`
                            : ""}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:flex-col sm:items-end">
                      <p className="font-bold text-slate-900 text-lg">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm text-[#ff7a00] font-medium">
                        Details <FaChevronRight className="text-xs" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}