import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingBag } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl, formatPrice, getDiscountedPrice } from "../../utils/imageUtils";

export default function WishlistPage() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="text-center py-20">
          <p className="text-slate-600 mb-4">Please login to view your wishlist</p>
          <Link to="/login" className="text-[#ff7a00] font-semibold">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <FaHeart className="text-[#ff7a00]" /> Wishlist
        </h1>

        {loading ? (
          <p className="text-center py-16 text-slate-400">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium mb-2">Your wishlist is empty</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#ff7a00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <FaShoppingBag /> Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => {
              const finalPrice = getDiscountedPrice(
                item.price,
                item.discountPercent
              );
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group"
                >
                  <Link to={`/products/${item.productId}`}>
                    <div className="aspect-square bg-slate-50 p-3">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-[#ff7a00] font-bold text-sm mb-3">
                      {formatPrice(finalPrice)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.productId)}
                      className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl py-2 hover:bg-red-50"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}