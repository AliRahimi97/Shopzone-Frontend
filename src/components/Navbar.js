import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaStore } from "react-icons/fa";

const Navbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <FaBars className="text-lg" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">Admin Panel</h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            ShopZone management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#ff7a00] px-3 py-2 rounded-lg hover:bg-orange-50 transition"
        >
          <FaStore />
          View store
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#ff7a00] text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;