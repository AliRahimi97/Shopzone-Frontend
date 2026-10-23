import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import Button from "./Button";
import { useWishlist } from "../../context/WishlistContext";
import {
  getImageUrl,
  getDiscountedPrice,
  formatPrice,
} from "../../utils/imageUtils";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [favLoading, setFavLoading] = useState(false);

  if (!product) return null;

  const productId = product.productId ?? product.id;
  const discount = product.discountPercent || 0;
  const finalPrice = getDiscountedPrice(product.price, discount);
  const image = getImageUrl(product.imageUrl);
  const liked = productId ? isInWishlist(Number(productId)) : false;
  const token = localStorage.getItem("token");

  const go = () => {
    if (productId) navigate(`/products/${productId}`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }
    if (!productId || favLoading) return;

    try {
      setFavLoading(true);
      await toggleWishlist(Number(productId));
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    go();
  };

  return (
    <div
      onClick={go}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Image — relative for absolute badges */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          disabled={favLoading}
          onClick={handleWishlist}
          title={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow transition
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
            ${
              liked
                ? "bg-red-50 text-red-500"
                : "bg-white/95 text-slate-400 hover:text-red-500"
            }
            disabled:opacity-60`}
        >
          <FaHeart className="text-sm" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {product.brand && (
          <p className="text-xs text-[#ff7a00] font-semibold uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
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
          <span className="text-slate-400 ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-extrabold text-slate-900">
              {formatPrice(finalPrice)}
            </p>
            {discount > 0 && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            className="!px-3 !py-2 shrink-0"
            onClick={handleAddClick}
          >
            <FaShoppingCart className="text-sm" />
          </Button>
        </div>
      </div>
    </div>
  );
}