import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaFire, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ProductService } from "../../service/ProductService";
import ProductCard from "../../components/ui/ProductCard";

const HotPicks = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    ProductService.hotProducts(token, 20)
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#ff7a00] text-sm font-semibold mb-1">
            <FaFire />
            Hot Picks
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Our most popular products right now
          </h2>
        </div>
        <Link
          to="/category/ELECTRONICS"
          className="text-sm font-semibold text-[#ff7a00] hover:underline shrink-0"
        >
          View All →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="relative px-1 sm:px-12">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: ".hot-picks-prev",
              nextEl: ".hot-picks-next",
            }}
            pagination={{
              clickable: true,
              el: ".hot-picks-pagination",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={products.length > 4}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="hot-picks-swiper !pb-2"
          >
            {products.map((product) => (
              <SwiperSlide key={product.productId} className="h-auto">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Modern nav buttons */}
          <button
            type="button"
            className="hot-picks-prev absolute left-0 top-[42%] -translate-y-1/2 z-10
              hidden sm:flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white border border-slate-200 shadow-md
              text-slate-500
              hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
              transition-all duration-300"
            aria-label="Previous products"
          >
            <FaChevronLeft className="text-xs" />
          </button>

          <button
            type="button"
            className="hot-picks-next absolute right-0 top-[42%] -translate-y-1/2 z-10
              hidden sm:flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white border border-slate-200 shadow-md
              text-slate-500
              hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
              transition-all duration-300"
            aria-label="Next products"
          >
            <FaChevronRight className="text-xs" />
          </button>

          {/* Soft pagination dots */}
          <div className="hot-picks-pagination flex justify-center gap-1.5 mt-6" />
        </div>
      ) : (
        <p className="text-center text-slate-400 py-10">
          No hot products available
        </p>
      )}

      <style>{`
        .hot-picks-swiper .swiper-button-prev,
        .hot-picks-swiper .swiper-button-next {
          display: none !important;
        }
        .hot-picks-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          border-radius: 999px;
          transition: all 0.25s ease;
        }
        .hot-picks-pagination .swiper-pagination-bullet-active {
          background: #ff7a00;
          width: 22px;
        }
      `}</style>
    </section>
  );
};

export default HotPicks;