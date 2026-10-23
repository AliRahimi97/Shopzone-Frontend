import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import {
  FaShoppingCart,
  FaStar,
  FaCheck,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ProductService } from "../../service/ProductService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Header from "./Header";
import Footer from "./Footer";
import {
  getImageUrl,
  getDiscountedPrice,
  formatPrice,
} from "../../utils/imageUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [favLoading, setFavLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setThumbsSwiper(null);
    setMainSwiper(null);
    ProductService.getProduct(token, id)
      .then((res) => {
        setProduct(res.data);
        setError(null);
        setQuantity(1);
        setMessage("");
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const productId = product?.productId ?? product?.id;
  const liked = productId ? isInWishlist(Number(productId)) : false;

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  const increaseQty = () => {
    const stock = product?.stock ?? 0;
    setQuantity((q) => (stock > 0 ? Math.min(stock, q + 1) : q));
  };

  const handleAddToCart = async () => {
    if (!productId) {
      setMessage("Invalid product");
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }
    if ((product.stock ?? 0) <= 0) {
      setMessage("Out of stock");
      return;
    }
    try {
      setAdding(true);
      setMessage("");
      await addToCart(Number(productId), Number(quantity));
      navigate("/cart");
    } catch (err) {
      console.error(err);
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!productId) return;
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setFavLoading(true);
      await toggleWishlist(Number(productId));
    } catch {
      navigate("/login");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-slate-400">
          Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="text-center py-32">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <Link to="/" className="text-[#ff7a00] font-semibold">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.discountPercent || 0;
  const finalPrice = getDiscountedPrice(product.price, discount);
  const images =
    product.images?.length > 0
      ? product.images
      : product.imageUrl
      ? [{ id: 0, imageUrl: product.imageUrl }]
      : [];
  const hasMultipleImages = images.length > 1;
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#ff7a00]">
            Home
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                to={`/category/${product.category}`}
                className="hover:text-[#ff7a00]"
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10">
            {/* Gallery */}
            <div>
              {images.length > 0 ? (
                <>
                  <div className="relative group">
                    {discount > 0 && (
                      <span className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        -{discount}% OFF
                      </span>
                    )}

                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setMainSwiper}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50"
                    >
                      {images.map((img) => (
                        <SwiperSlide key={img.id || img.imageUrl}>
                          <div className="flex items-center justify-center h-[360px] md:h-[480px] p-4 md:p-6">
                            <img
                              src={getImageUrl(img.imageUrl)}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/600x600?text=No+Image";
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={() => mainSwiper?.slidePrev()}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                            w-10 h-10 rounded-full
                            bg-white/95 border border-slate-200 shadow-md
                            text-slate-500
                            hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
                            flex items-center justify-center
                            transition-all duration-300
                            opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => mainSwiper?.slideNext()}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                            w-10 h-10 rounded-full
                            bg-white/95 border border-slate-200 shadow-md
                            text-slate-500
                            hover:text-[#ff7a00] hover:border-orange-200 hover:shadow-lg
                            flex items-center justify-center
                            transition-all duration-300
                            opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <FaChevronRight className="text-xs" />
                        </button>
                      </>
                    )}
                  </div>

                  {hasMultipleImages && (
                    <Swiper
                      modules={[FreeMode, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={12}
                      slidesPerView={4}
                      freeMode
                      watchSlidesProgress
                      className="mt-4"
                    >
                      {images.map((img) => (
                        <SwiperSlide key={`t-${img.id || img.imageUrl}`}>
                          <button
                            type="button"
                            className="w-full block"
                            onClick={() => {
                              /* thumbs module handles sync */
                            }}
                          >
                            <img
                              src={getImageUrl(img.imageUrl)}
                              alt=""
                              className="w-full h-20 object-contain rounded-xl border-2 border-slate-100 hover:border-[#ff7a00] cursor-pointer transition bg-slate-50 p-1"
                            />
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              ) : (
                <div className="h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  No image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-[#ff7a00] text-sm font-semibold uppercase tracking-wider mb-2">
                {product.brand}
              </p>

              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-5 text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      className={
                        s <= Math.round(product.rating || 4)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="font-medium text-slate-800">
                  {product.rating || 4.5}
                </span>
                <span className="text-slate-400">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="flex flex-wrap items-end gap-3 mb-6">
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900">
                  {formatPrice(finalPrice)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-slate-400 line-through mb-1">
                      {formatPrice(product.price)}
                    </span>
                    <span className="mb-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6">
                {inStock ? (
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm bg-emerald-50 px-3 py-1.5 rounded-full">
                    <FaCheck className="text-xs" /> In stock — {product.stock}{" "}
                    available
                  </span>
                ) : (
                  <span className="inline-flex text-red-600 font-medium text-sm bg-red-50 px-3 py-1.5 rounded-full">
                    Out of stock
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              <p className="text-sm text-slate-500 mb-6">
                Category:{" "}
                <Link
                  to={`/category/${product.category}`}
                  className="font-medium text-slate-800 hover:text-[#ff7a00]"
                >
                  {product.category}
                </Link>
              </p>

              {inStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-slate-700">
                    Quantity
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={decreaseQty}
                      className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-12 text-center font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={increaseQty}
                      className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!inStock || adding}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#ff7a00] hover:bg-[#e56e00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition shadow-lg shadow-orange-200/60"
                >
                  <FaShoppingCart className="text-lg" />
                  {adding
                    ? "Adding to cart..."
                    : inStock
                    ? "Add to Cart & View Cart"
                    : "Out of Stock"}
                </button>

                <button
                  type="button"
                  disabled={favLoading}
                  onClick={handleWishlist}
                  title={liked ? "Remove from wishlist" : "Add to wishlist"}
                  className={`w-14 sm:w-16 shrink-0 flex items-center justify-center rounded-2xl border-2 transition ${
                    liked
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <FaHeart className="text-xl" />
                </button>
              </div>

              {message && (
                <p className="mt-3 text-sm font-medium text-red-600">{message}</p>
              )}

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <FaTruck className="text-[#ff7a00] mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <FaShieldAlt className="text-[#ff7a00] mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Secure Payment
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <FaUndo className="text-[#ff7a00] mb-1" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;