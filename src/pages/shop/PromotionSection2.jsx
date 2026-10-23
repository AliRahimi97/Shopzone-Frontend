import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight, FaPercent } from "react-icons/fa";
import { ProductService } from "../../service/ProductService";
import ProductCard from "../../components/ui/ProductCard";

const DiscountProducts = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    ProductService.discountProducts(token, 0)
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#ff7a00] text-sm font-semibold mb-1">
            <FaPercent className="text-xs" />
            Limited Offers
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Hot Deals For You
          </h2>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="relative px-1 sm:px-12">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: ".discount-prev",
              nextEl: ".discount-next",
            }}
            pagination={{
              clickable: true,
              el: ".discount-pagination",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={products.length > 4}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="discount-swiper !pb-2"
          >
            {products.map((product) => (
              <SwiperSlide key={product.productId} className="h-auto">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className="discount-prev absolute left-0 top-[42%] -translate-y-1/2 z-10
              hidden sm:flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white border border-slate-200 shadow-md
              text-slate-500
              hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
              transition-all duration-300"
            aria-label="Previous deals"
          >
            <FaChevronLeft className="text-xs" />
          </button>

          <button
            type="button"
            className="discount-next absolute right-0 top-[42%] -translate-y-1/2 z-10
              hidden sm:flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white border border-slate-200 shadow-md
              text-slate-500
              hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
              transition-all duration-300"
            aria-label="Next deals"
          >
            <FaChevronRight className="text-xs" />
          </button>

          <div className="discount-pagination flex justify-center gap-1.5 mt-6" />
        </div>
      ) : (
        <p className="text-center text-slate-400 py-10">
          No deals available right now
        </p>
      )}

      <style>{`
        .discount-swiper .swiper-button-prev,
        .discount-swiper .swiper-button-next {
          display: none !important;
        }
        .discount-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          border-radius: 999px;
          transition: all 0.25s ease;
        }
        .discount-pagination .swiper-pagination-bullet-active {
          background: #ff7a00;
          width: 22px;
        }
      `}</style>
    </section>
  );
};

export default DiscountProducts;