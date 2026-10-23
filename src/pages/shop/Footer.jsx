import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-16">
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FaTruck, t: "Free Shipping", d: "On orders over $50" },
            { icon: FaUndo, t: "Easy Returns", d: "30-day return policy" },
            { icon: FaShieldAlt, t: "Secure Payment", d: "100% protected" },
            { icon: FaHeadset, t: "24/7 Support", d: "Dedicated help" },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#ff7a00]/15 text-[#ff7a00] flex items-center justify-center">
                <x.icon />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{x.t}</p>
                <p className="text-xs text-slate-500">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white text-xl font-extrabold mb-4">
            Online<span className="text-[#ff7a00]">Shop</span>
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            Premium electronics and smart devices at the best prices. Quality you can trust.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#ff7a00]" /> Mirpur 1, Dhaka</p>
            <p className="flex items-center gap-2"><FaPhoneAlt className="text-[#ff7a00]" /> +1 (555) 123-4567</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-[#ff7a00]" /> support@onlineshop.com</p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Shop", "About Us", "Contact"].map((l) => (
              <li key={l}>
                <Link to={l === "Home" ? "/" : "#"} className="hover:text-[#ff7a00] transition">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {["Electronics", "Clothing", "Home", "Beauty", "Sports"].map((c) => (
              <li key={c}>
                <Link to={`/category/${c.toUpperCase()}`} className="hover:text-[#ff7a00] transition">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-slate-400 mb-4">Get exclusive deals and updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 mb-5">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none focus:border-[#ff7a00]"
            />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e56e00] text-white text-sm font-semibold transition">
              Subscribe
            </button>
          </form>
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-[#ff7a00] hover:border-[#ff7a00] transition"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} <span className="text-[#ff7a00] font-semibold">OnlineShop</span>. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#ff7a00]">Privacy</a>
            <a href="#" className="hover:text-[#ff7a00]">Terms</a>
            <a href="#" className="hover:text-[#ff7a00]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}