import { Link } from "react-router-dom";
import { FaStar, FaUndo, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Button from "../../components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 text-[#ff7a00] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 shadow-sm">
              New Season · Latest Technology
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] mb-4">
              Upgrade Your Life
              <br />
              With <span className="text-[#ff7a00]">Smart Tech</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-md mb-6">
              Explore premium electronics, accessories and smart devices at the
              best prices. Quality you can trust.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <FaStar className="text-amber-400" /> 4.9/5 Customer Rating
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaUndo className="text-[#ff7a00]" /> 30-Day Easy Returns
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaShieldAlt className="text-emerald-500" /> Secure Payment
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/category/ELECTRONICS">
                <Button size="lg">
                  Shop Now <FaArrowRight className="text-sm" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="secondary">
                  View Deals %
                </Button>
              </Link>
            </div>
          </div>

          {/* Right product collage */}
          <div className="relative">
            <div className="absolute -top-2 right-4 z-10 bg-[#ff7a00] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              New Arrivals
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-orange-100 via-white to-slate-100 p-6 shadow-xl border border-orange-100/60">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80"
                alt="Smart tech products"
                className="w-full h-[320px] sm:h-[380px] object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}