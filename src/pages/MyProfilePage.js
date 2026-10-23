import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaWallet,
  FaChevronRight,
  FaLock,
  FaMapMarkerAlt,
  FaBell,
  FaEdit,
} from "react-icons/fa";
import { getUserInfo } from "../api/UserRequest";
import { AuthContext } from "../context/AuthContext";
import { OrderService } from "../service/OrderService";
import { parseJwt } from "../utils/JwtUtils";
import Header from "./shop/Header"; // adjust path if needed
import Footer from "./shop/Footer"; // adjust path if needed

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
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function getInitials(firstName, lastName, email) {
  const a = (firstName || "").trim().charAt(0);
  const b = (lastName || "").trim().charAt(0);
  if (a || b) return `${a}${b}`.toUpperCase();
  return (email || "U").charAt(0).toUpperCase();
}

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />
  );
}

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserInfo();
        setUser(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load profile");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrdersLoading(false);
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
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        const res = await OrderService.getMyOrders(token, userId);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (isAuthenticated) loadOrders();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) =>
      ["DELIVERED", "PAID"].includes(String(o.status || "").toUpperCase())
    ).length;
    const processing = orders.filter((o) =>
      ["PENDING", "SHIPPED"].includes(String(o.status || "").toUpperCase())
    ).length;
    const spend = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );
    return { total, completed, processing, spend };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "";
  const role =
    user?.role ||
    user?.roles?.[0] ||
    parseJwt(localStorage.getItem("token"))?.role ||
    "CUSTOMER";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account, orders, and preferences
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Profile header */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="h-24 bg-gradient-to-r from-[#ff7a00] to-orange-400" />
          <div className="px-6 pb-6 -mt-10">
            {loading ? (
              <div className="flex items-end gap-4">
                <SkeletonBlock className="w-24 h-24 rounded-2xl" />
                <div className="flex-1 space-y-2 pb-2">
                  <SkeletonBlock className="h-6 w-48" />
                  <SkeletonBlock className="h-4 w-64" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-extrabold text-[#ff7a00]">
                  {getInitials(user?.firstName, user?.lastName, user?.email)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 truncate">
                      {fullName}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#ff7a00] border border-orange-100">
                      {String(role).toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <FaEnvelope className="text-slate-400" />
                    {user?.email}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <FaCalendarAlt />
                    Member since {formatDate(user?.createdOn || user?.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:border-[#ff7a00] hover:text-[#ff7a00] transition"
                >
                  <FaEdit />
                  Edit profile
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Quick links */}
        <section className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff7a00] flex items-center justify-center text-xl">
              <FaBoxOpen />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 group-hover:text-[#ff7a00]">
                My Orders
              </p>
              <p className="text-xs text-slate-500">Track and view purchases</p>
            </div>
            <FaChevronRight className="text-slate-300 group-hover:text-[#ff7a00]" />
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff7a00] flex items-center justify-center text-xl">
              <FaShoppingCart />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 group-hover:text-[#ff7a00]">
                My Cart
              </p>
              <p className="text-xs text-slate-500">Review items before checkout</p>
            </div>
            <FaChevronRight className="text-slate-300 group-hover:text-[#ff7a00]" />
          </Link>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total orders",
              value: stats.total,
              icon: FaBoxOpen,
              color: "text-[#ff7a00] bg-orange-50",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: FaCheckCircle,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Processing",
              value: stats.processing,
              icon: FaClock,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Total spent",
              value: `$${stats.spend.toFixed(2)}`,
              icon: FaWallet,
              color: "text-slate-700 bg-slate-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}
              >
                <s.icon />
              </div>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900">
                {ordersLoading ? "—" : s.value}
              </p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Personal info */}
          <section className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Personal information</h3>
            {loading ? (
              <div className="space-y-3">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-4/6" />
              </div>
            ) : (
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <FaUser className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Full name</p>
                    <p className="font-medium text-slate-800">{fullName}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaEnvelope className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium text-slate-800 break-all">
                      {user?.email || "—"}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaPhone className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Mobile</p>
                    <p className="font-medium text-slate-800">
                      {user?.mobile || "Not set"}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaMapMarkerAlt className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="font-medium text-slate-800">
                      {user?.address || "No address saved"}
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </section>

          {/* Recent orders */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Recent orders</h3>
              <Link
                to="/orders"
                className="text-sm font-semibold text-[#ff7a00] hover:underline"
              >
                View all
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                <SkeletonBlock className="h-16 w-full" />
                <SkeletonBlock className="h-16 w-full" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <FaBoxOpen className="text-3xl text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm mb-4">No orders yet</p>
                <Link
                  to="/"
                  className="inline-flex bg-[#ff7a00] text-white text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const st = String(order.status || "PENDING").toUpperCase();
                  const badge = statusStyles[st] || statusStyles.PENDING;
                  return (
                    <Link
                      key={order.orderId}
                      to={`/orders/${order.orderId}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">
                            #{order.orderId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge}`}
                          >
                            {st}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <p className="font-bold text-slate-900">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </p>
                      <FaChevronRight className="text-slate-300 text-xs" />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Settings shortcuts */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Account settings</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: FaEdit,
                title: "Edit information",
                desc: "Update name & contact",
              },
              {
                icon: FaLock,
                title: "Change password",
                desc: "Keep your account secure",
              },
              {
                icon: FaMapMarkerAlt,
                title: "Manage addresses",
                desc: "Shipping addresses",
              },
              {
                icon: FaBell,
                title: "Notifications",
                desc: "Email & order alerts",
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                className="text-left p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition"
              >
                <item.icon className="text-[#ff7a00] mb-2" />
                <p className="font-semibold text-slate-900 text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Edit / password / addresses can be wired to APIs in the next iteration.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyProfilePage;