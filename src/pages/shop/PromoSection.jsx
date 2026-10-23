import { Link } from "react-router-dom";
import sam from "../../assets/images/samsung.png";
import app from "../../assets/images/apple.png";
import { FaArrowRight } from "react-icons/fa";

const brands = [
  {
    id: 1,
    banner: app,
    name: "Apple",
    link: "/brand/Apple",
    gradient: "from-gray-900 via-gray-800 to-black",
    glow: "shadow-[0_0_60px_rgba(255,122,0,0.25)]",
  },
  {
    id: 2,
    banner: sam,
    name: "Samsung",
    link: "/brand/Samsung",
    gradient: "from-blue-950 via-slate-900 to-black",
    glow: "shadow-[0_0_60px_rgba(30,144,255,0.25)]",
  },
];

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-12">
        Special Brands
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={brand.link}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-black h-[420px] shadow-2xl"
          >
            {/* Background image */}
            <img
              src={brand.banner}
              alt={brand.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-700"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Glow */}
            <div className={`absolute inset-0 ${brand.glow} opacity-40 group-hover:opacity-60 transition-all duration-700`} />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-[#ff7a00] rounded-full" />
                <span className="uppercase tracking-[2px] text-xs text-[#ff7a00] font-medium">
                  Premium
                </span>
              </div>

              <h3 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                {brand.name}
              </h3>

              <p className="text-slate-300 text-sm max-w-xs mb-8">
                Discover the latest {brand.name} products with premium design and advanced technology.
              </p>

              <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                <span className="text-white font-semibold text-sm uppercase tracking-widest">
                  Shop Now
                </span>
                <FaArrowRight className="text-[#ff7a00] group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}