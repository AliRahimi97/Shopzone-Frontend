import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaDollarSign,
  FaSync,
  FaArrowRight,
} from "react-icons/fa";
import { UserService } from "../service/UserService";
import { OrderService } from "../service/OrderService";
import { ProductService } from "../service/ProductService";


const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-50 text-red-600",
};

function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    if (!token) {
      setError("Please login as admin");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [usersRes, ordersRes, productsRes] = await Promise.all([
        UserService.getAllUsers(token),
        OrderService.getAllOrders(token),
        ProductService.getAll(token),
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // در OrderResponse فیلد totalAmount است (نه total)
  const totalSales = useMemo(
    () =>
      orders.reduce(
        (sum, o) => sum + Number(o.totalAmount ?? o.total ?? 0),
        0
      ),
    [orders]
  );

  const statusCounts = useMemo(() => {
    const map = {
      PENDING: 0,
      PAID: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o) => {
      const s = String(o.status || "").toUpperCase();
      if (map[s] !== undefined) map[s] += 1;
    });
    return map;
  }, [orders]);

  const lowStock = useMemo(
    () =>
      products
        .filter((p) => Number(p.stock ?? 0) > 0 && Number(p.stock) <= 10)
        .slice(0, 5),
    [products]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.orderDate || 0) - new Date(a.orderDate || 0)
        )
        .slice(0, 6),
    [orders]
  );

  const cards = [
    {
      label: "Users",
      value: users.length,
      icon: FaUsers,
      to: "/admin/users",
      color: "text-blue-700 bg-blue-50",
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Orders",
      value: orders.length,
      icon: FaShoppingCart,
      to: "/admin/orders",
      color: "text-sky-700 bg-sky-50",
      iconBg: "bg-sky-100 text-sky-700",
    },
    {
      label: "Products",
      value: products.length,
      icon: FaBoxOpen,
      to: "/admin/products",
      color: "text-amber-700 bg-amber-50",
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      label: "Total Sales",
      value: formatMoney(totalSales),
      icon: FaDollarSign,
      to: "/admin/orders",
      color: "text-rose-700 bg-rose-50",
      iconBg: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of users, orders, products and sales
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-[#ff7a00] hover:text-[#ff7a00]"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}
              >
                <c.icon className="text-xl" />
              </div>
              <FaArrowRight className="text-slate-300 group-hover:text-[#ff7a00] text-sm mt-1" />
            </div>
            <p className="text-xs text-slate-500 mb-1">{c.label}</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "—" : c.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-4">Orders by status</h2>
          <div className="space-y-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    statusStyles[status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {status}
                </span>
                <span className="font-semibold text-slate-800">
                  {loading ? "—" : count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Low stock products</h2>
            <Link
              to="/admin/products"
              className="text-sm font-semibold text-[#ff7a00] hover:underline"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : lowStock.length === 0 ? (
            <p className="text-slate-500 text-sm">No low-stock items</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div
                  key={p.productId || p.id}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <p className="text-sm font-medium text-slate-800 truncate pr-3">
                    {p.name}
                  </p>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    Stock: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-[#ff7a00] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-12 text-slate-400">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-center py-12 text-slate-500 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((o) => {
                  const st = String(o.status || "PENDING").toUpperCase();
                  return (
                    <tr key={o.orderId} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/details/${o.orderId}`}
                          className="font-bold text-[#ff7a00] hover:underline"
                        >
                          #{o.orderId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(o.orderDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {o.userEmail || o.email || `User #${o.userId || "—"}`}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            statusStyles[st] || "bg-slate-100"
                          }`}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatMoney(o.totalAmount ?? o.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Optional charts — uncomment if components exist
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <LineChart />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <TeamABarChart />
        </div>
      </div>
      */}
    </div>
  );
}