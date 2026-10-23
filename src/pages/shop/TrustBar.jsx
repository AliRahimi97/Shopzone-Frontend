import { FaTruck, FaTag, FaHeadset, FaLock } from "react-icons/fa";

const items = [
  { icon: FaTruck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: FaTag, title: "Best Price", desc: "Guaranteed" },
  { icon: FaHeadset, title: "24/7 Support", desc: "Always here for you" },
  { icon: FaLock, title: "Secure Payment", desc: "100% Safe & Encrypted" },
];

export default function TrustBar() {
  return (
    <section className="max-w-8xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#ff7a00] flex items-center justify-center">
                <Icon />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}