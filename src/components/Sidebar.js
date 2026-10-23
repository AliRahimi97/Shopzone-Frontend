import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaEnvelope,
  FaCog,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: FaHome, end: true },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Products", path: "/admin/products", icon: FaBoxOpen },
  { name: "Orders", path: "/admin/orders", icon: FaShoppingCart },
  { name: "Messages", path: "/admin/messages", icon: FaEnvelope },
  { name: "Settings", path: "/admin/settings", icon: FaCog },
];

function isActive(pathname, item) {
  if (item.end) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(item.path + "/");
}

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={[
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-100",
        "transform transition-transform duration-300 ease-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#ff7a00] text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm leading-tight">
              ShopZone
            </p>
            <p className="text-[10px] text-slate-400">Admin</p>
          </div>
        </div>
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(location.pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition",
                active
                  ? "bg-[#ff7a00] text-white shadow-sm shadow-orange-200"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff7a00]",
              ].join(" ")}
            >
              <Icon className="text-base shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
        ShopZone Admin v1
      </div>
    </aside>
  );
};

export default Sidebar;