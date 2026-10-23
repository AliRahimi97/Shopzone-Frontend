import { useMemo } from "react";
import {
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaServer,
  FaDesktop,
  FaShoppingCart,
  FaUserShield,
  FaDatabase,
  FaPaintBrush,
  FaVial,
  FaRocket,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

const PROJECT_DATA = {
  lastUpdated: "2026-09-18",
  currentPhase: "Admin polish + optional features",
  overallPercent: 82,

  modules: [
    {
      id: "frontend",
      name: "Frontend",
      percent: 88,
      status: "In Progress",
      priority: "Medium",
      icon: FaDesktop,
      color: "bg-blue-500",
      completed: [
        "Home page + unified ProductCard system",
        "Product Detail + gallery + Add to Cart",
        "DiscountProducts / HotPicks / Promo sections",
        "CategoryProducts + BrandProducts",
        "Header (cart badge, Orders, Account)",
        "Hero, Footer, design system (#ff7a00)",
        "Cart page (qty / remove / summary)",
        "Checkout + Place Order",
        "Order confirmation page",
        "Customer order history + order detail",
        "My Profile (stats, recent orders, quick links)",
        "Login + Register (premium UI + validation)",
        "404 NotFound page",
        "Admin layout (Sidebar / Navbar / DefaultLayout)",
        "Admin Dashboard (live metrics)",
        "Admin Orders list + detail + status update",
        "Admin Users list + user detail",
        "Admin Messages UI (placeholder API)",
        "Admin Settings UI (demo password / theme)",
        "Project progress dashboard",
      ],
      remaining: [
        "Working global product search",
        "Wishlist (optional)",
        "Skeleton loaders everywhere",
        "Final mobile polish pass",
      ],
    },
    {
      id: "backend",
      name: "Backend",
      percent: 85,
      status: "In Progress",
      priority: "Medium",
      icon: FaServer,
      color: "bg-emerald-500",
      completed: [
        "Product CRUD + ProductImage gallery",
        "JOIN FETCH / image endpoints",
        "Discount / hot / brand / category filters",
        "JWT auth + SecurityConfig roles",
        "File upload storage",
        "Cart APIs (add / update / remove / get)",
        "Checkout + Order + Payment flow",
        "Customer order list + detail",
        "Admin orders list + status update",
        "Admin users list + user by id",
        "OrderResponse userEmail / userId",
      ],
      remaining: [
        "Contact/Messages real API",
        "Change-password API",
        "Review & rating APIs",
        "Search endpoint",
        "Token refresh (optional)",
      ],
    },
    {
      id: "customer",
      name: "Customer-Facing Module",
      percent: 90,
      status: "In Progress",
      priority: "Medium",
      icon: FaShoppingCart,
      color: "bg-orange-500",
      completed: [
        "Browse products + detail + gallery",
        "Category / brand listing",
        "Add to Cart + live cart count",
        "Cart management",
        "Checkout + order confirmation",
        "Order history + order detail",
        "Profile page with order stats",
        "Login / Register flow",
      ],
      remaining: [
        "Wishlist (optional)",
        "Product search on storefront",
        "Address book (optional)",
      ],
    },
    {
      id: "admin",
      name: "Admin Panel",
      percent: 80,
      status: "In Progress",
      priority: "Medium",
      icon: FaUserShield,
      color: "bg-purple-500",
      completed: [
        "Admin layout + orange sidebar/navbar",
        "Product list / add / edit",
        "Dashboard with real users/orders/products/sales",
        "Orders management (list, filters, status)",
        "Order detail page",
        "Users list + search/filter + detail",
        "Messages page UI (mock)",
        "Settings page UI (demo)",
      ],
      remaining: [
        "Multi-image admin product UX polish",
        "Change user role / deactivate (deferred)",
        "Messages Spring API",
        "Real change-password API",
      ],
    },
    {
      id: "auth",
      name: "Authentication & Security",
      percent: 75,
      status: "In Progress",
      priority: "Medium",
      icon: FaUserShield,
      color: "bg-indigo-500",
      completed: [
        "Login / Register premium UI",
        "JWT parse utils (null-safe)",
        "ProtectedRoute + RoleRoute",
        "Admin endpoints hasRole(ADMIN)",
        "Logout from admin navbar",
        "Axios Bearer pattern",
      ],
      remaining: [
        "Token refresh",
        "Password reset",
        "Stricter validation messages",
      ],
    },
    {
      id: "database",
      name: "Database",
      percent: 85,
      status: "In Progress",
      priority: "Low",
      icon: FaDatabase,
      color: "bg-cyan-500",
      completed: [
        "Product + ProductImage",
        "Users",
        "CartItem",
        "OrderShop + OrderItem + Payment",
        "Order status constraint fixed",
        "Identity / PK fixes for cart",
      ],
      remaining: [
        "ContactMessage table (later)",
        "Review table (optional)",
        "Clean deprecated product.image_url",
      ],
    },
    {
      id: "uiux",
      name: "UI / UX Consistency",
      percent: 85,
      status: "In Progress",
      priority: "Medium",
      icon: FaPaintBrush,
      color: "bg-pink-500",
      completed: [
        "Primary orange system (#ff7a00)",
        "Shared ProductCard + Button",
        "Storefront + admin visual alignment",
        "Login / Register split layout",
        "Admin shell consistency",
        "Customer profile / cart / checkout styling",
      ],
      remaining: [
        "Skeleton loaders",
        "Stronger empty states on a few pages",
        "Final mobile carousel pass",
      ],
    },
    {
      id: "testing",
      name: "Testing & Optimization",
      percent: 25,
      status: "Pending",
      priority: "Low",
      icon: FaVial,
      color: "bg-slate-500",
      completed: [
        "Manual Postman tests (cart, order, admin)",
        "Manual browser flows (login → checkout → orders)",
      ],
      remaining: [
        "Automated unit / integration tests",
        "Lighthouse / a11y pass",
        "Pagination for large lists",
      ],
    },
  ],

  roadmap: [
    { id: 1, title: "Backend product + image gallery", status: "Completed" },
    { id: 2, title: "Storefront design system + pages", status: "Completed" },
    { id: 3, title: "Cart + Checkout + Customer orders", status: "Completed" },
    { id: 4, title: "Admin orders + users + dashboard", status: "Completed" },
    { id: 5, title: "Auth pages + admin shell polish", status: "Completed" },
    { id: 6, title: "Messages + Settings real APIs", status: "Current" },
    { id: 7, title: "Search, wishlist, reviews (optional)", status: "Upcoming" },
    { id: 8, title: "Tests, performance, production hardening", status: "Upcoming" },
  ],

  technicalDebt: [
    {
      area: "UI/UX",
      items: [
        "Skeleton loaders still limited",
        "Mobile carousel final pass",
        "Messages still on mock port 5000",
      ],
    },
    {
      area: "Architecture",
      items: [
        "Hardcoded localhost:8080 in some services",
        "Settings password change is demo-only",
        "No dedicated admin get-order-by-id (uses list find)",
      ],
    },
    {
      area: "Performance",
      items: [
        "No pagination on admin/product lists",
        "Image optimization not applied",
      ],
    },
    {
      area: "Security",
      items: [
        "JWT in localStorage (XSS awareness)",
        "No refresh-token flow yet",
      ],
    },
  ],
};

const statusStyles = {
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Pending: "bg-slate-100 text-slate-600 border-slate-200",
  Blocked: "bg-red-100 text-red-700 border-red-200",
  Current: "bg-orange-100 text-orange-700 border-orange-200",
  Upcoming: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityStyles = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-slate-400 text-white",
};

function ProgressBar({ percent, color = "bg-orange-500" }) {
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${accent}`}
        >
          <Icon className="text-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectDashboard() {
  const data = PROJECT_DATA;

  const totals = useMemo(() => {
    let completed = 0;
    let remaining = 0;
    data.modules.forEach((m) => {
      completed += m.completed.length;
      remaining += m.remaining.length;
    });
    return { completed, remaining, total: completed + remaining };
  }, [data]);

  const highPriority = data.modules
    .filter((m) => m.priority === "Critical" || m.priority === "High")
    .flatMap((m) =>
      m.remaining.slice(0, 3).map((task) => ({
        task,
        module: m.name,
        priority: m.priority,
      }))
    );

  // If no Critical/High left, show Medium remaining tasks
  const trackerRows =
    highPriority.length > 0
      ? highPriority
      : data.modules
          .filter((m) => m.remaining.length > 0)
          .flatMap((m) =>
            m.remaining.slice(0, 2).map((task) => ({
              task,
              module: m.name,
              priority: m.priority,
            }))
          );

  const nextSteps = [
    "Wire Messages to Spring Boot (entity + admin APIs)",
    "Real change-password endpoint + Settings form",
    "Storefront global search",
    "Optional: wishlist / reviews",
    "Pagination + tests before production",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold mb-2">
                <FaRocket />
                Project Management Hub
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                ShopZone Progress Dashboard
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Last updated: {data.lastUpdated} · Single source of truth for
                development status
              </p>
            </div>
            <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700 min-w-[200px]">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                Overall completion
              </p>
              <p className="text-4xl font-black text-orange-400">
                {data.overallPercent}%
              </p>
              <ProgressBar percent={data.overallPercent} color="bg-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overall Progress"
            value={`${data.overallPercent}%`}
            sub={data.currentPhase}
            icon={FaRocket}
            accent="bg-orange-500"
          />
          <StatCard
            label="Tasks Completed"
            value={totals.completed}
            sub={`of ${totals.total} tracked tasks`}
            icon={FaCheckCircle}
            accent="bg-emerald-500"
          />
          <StatCard
            label="Tasks Remaining"
            value={totals.remaining}
            sub="Across all modules"
            icon={FaClock}
            accent="bg-blue-500"
          />
          <StatCard
            label="Current Phase"
            value="Phase B+"
            sub="Core commerce done · polish next"
            icon={FaSpinner}
            accent="bg-purple-500"
          />
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Module Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {data.modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${mod.color} text-white flex items-center justify-center`}
                      >
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{mod.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                              statusStyles[mod.status]
                            }`}
                          >
                            {mod.status}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              priorityStyles[mod.priority]
                            }`}
                          >
                            {mod.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-800">
                      {mod.percent}%
                    </span>
                  </div>

                  <ProgressBar percent={mod.percent} color={mod.color} />

                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-emerald-600 font-semibold mb-2 flex items-center gap-1">
                        <FaCheckCircle className="text-xs" /> Done (
                        {mod.completed.length})
                      </p>
                      <ul className="space-y-1 text-slate-600">
                        {mod.completed.slice(0, 4).map((t, i) => (
                          <li key={i} className="truncate text-xs">
                            • {t}
                          </li>
                        ))}
                        {mod.completed.length > 4 && (
                          <li className="text-xs text-slate-400">
                            +{mod.completed.length - 4} more
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-orange-600 font-semibold mb-2 flex items-center gap-1">
                        <FaClock className="text-xs" /> Remaining (
                        {mod.remaining.length})
                      </p>
                      <ul className="space-y-1 text-slate-600">
                        {mod.remaining.slice(0, 4).map((t, i) => (
                          <li key={i} className="truncate text-xs">
                            • {t}
                          </li>
                        ))}
                        {mod.remaining.length > 4 && (
                          <li className="text-xs text-slate-400">
                            +{mod.remaining.length - 4} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Development Roadmap
            </h2>
            <div className="space-y-3">
              {data.roadmap.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.status === "Completed"
                        ? "bg-emerald-500 text-white"
                        : m.status === "Current"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between border-b border-slate-100 pb-3">
                    <span
                      className={`font-medium ${
                        m.status === "Current"
                          ? "text-orange-600"
                          : "text-slate-800"
                      }`}
                    >
                      {m.title}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                        statusStyles[m.status]
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-2">Recommended Next Steps</h2>
            <p className="text-orange-100 text-sm mb-5">
              Highest leverage work right now
            </p>
            <ol className="space-y-3">
              {nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-4 border-t border-white/20 text-sm text-orange-100 flex items-center gap-2">
              <FaArrowRight />
              Strategy: Core customer + admin commerce is done — finish support
              APIs, then optional features
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            Priority Task Tracker
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Task</th>
                  <th className="pb-3 font-medium">Module</th>
                  <th className="pb-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {trackerRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="py-3 text-slate-800">{row.task}</td>
                    <td className="py-3 text-slate-500">{row.module}</td>
                    <td className="py-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          priorityStyles[row.priority]
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Technical Debt & Improvements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.technicalDebt.map((block) => (
              <div
                key={block.area}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <h3 className="font-bold text-slate-900 mb-3">{block.area}</h3>
                <ul className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-slate-400 pb-8">
          Update the{" "}
          <code className="bg-slate-100 px-1 rounded">PROJECT_DATA</code> object
          in this file whenever major features are completed to keep percentages
          accurate.
        </p>
      </div>
    </div>
  );
}