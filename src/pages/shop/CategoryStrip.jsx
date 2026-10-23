import { Link } from "react-router-dom";
import {
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaClock,
  FaTv,
  FaGamepad,
  FaCamera,
  FaHome,
} from "react-icons/fa";

const items = [
  { name: "Laptops", icon: FaLaptop, path: "/category/ELECTRONICS" },
  { name: "Mobiles", icon: FaMobileAlt, path: "/category/ELECTRONICS" },
  { name: "Headphones", icon: FaHeadphones, path: "/category/ELECTRONICS" },
  { name: "Smart Watch", icon: FaClock, path: "/category/ELECTRONICS" },
  { name: "TV & Audio", icon: FaTv, path: "/category/ELECTRONICS" },
  { name: "Gaming", icon: FaGamepad, path: "/category/ELECTRONICS" },
  { name: "Camera", icon: FaCamera, path: "/category/ELECTRONICS" },
  { name: "Smart Home", icon: FaHome, path: "/category/HOME" },
];

export default function CategoryStrip() {
  return (
    <section className="max-w-8xl mx-auto px-4 -mt-0 mb-8">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-orange-50 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-orange-100 flex items-center justify-center text-slate-600 group-hover:text-[#ff7a00] transition">
                <Icon className="text-lg" />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-700 text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}