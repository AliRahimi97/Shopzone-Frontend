import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaBars,
  FaBoxOpen,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useState } from "react";

const categories = [
  { name: "Electronics", path: "/category/ELECTRONICS" },
  { name: "Clothing", path: "/category/CLOTHING" },
  { name: "Books", path: "/category/BOOKS" },
  { name: "Home", path: "/category/HOME" },
  { name: "Beauty", path: "/category/BEAUTY" },
  { name: "Toys", path: "/category/TOYS" },
  { name: "Sports", path: "/category/SPORTS" },
  { name: "Food", path: "/category/FOOD" },
  { name: "Furniture", path: "/category/FURNITURE" },
];

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top promo bar */}
      <div className="bg-[#ff7a00] text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <p className="font-medium truncate">
            Mega Sale! Up to 50% OFF on Selected Items
          </p>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="opacity-90">Help Center</span>
            <span className="opacity-90">About Us</span>
            <Link to="/" className="hover:underline font-semibold">
              Shop Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#ff7a00] text-white flex items-center justify-center font-bold">
            S
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-extrabold text-slate-900 text-lg">ShopZone</div>
            <div className="text-[10px] text-slate-500 -mt-0.5">
              Smart Shopping for You
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 shrink-0">
          <FaMapMarkerAlt className="text-[#ff7a00]" />
          <span>Deliver to</span>
          <span className="font-semibold text-slate-800">Your Location!</span>
        </div>

        {/* Search — desktop */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl hidden md:flex"
        >
          <div className="flex w-full rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#ff7a00] transition">
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="flex-1 px-4 py-2.5 text-sm outline-none min-w-0"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-[#ff7a00] hover:bg-[#e56e00] text-white px-4 transition shrink-0"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hidden sm:flex flex-col items-center text-slate-600 hover:text-[#ff7a00] text-xs"
          >
            <FaHeart className="text-lg mb-0.5" />
            Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#ff7a00] text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-slate-600 hover:text-[#ff7a00] text-xs"
          >
            <FaShoppingCart className="text-lg mb-0.5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#ff7a00] text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <Link
                to="/orders"
                className="hidden sm:flex flex-col items-center text-slate-600 hover:text-[#ff7a00] text-xs"
              >
                <FaBoxOpen className="text-lg mb-0.5" />
                Orders
              </Link>
              <Link
                to="/me"
                className="hidden sm:flex flex-col items-center text-slate-600 hover:text-[#ff7a00] text-xs"
              >
                <FaUser className="text-lg mb-0.5" />
                Account
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex flex-col items-center text-slate-600 hover:text-[#ff7a00] text-xs"
            >
              <FaUser className="text-lg mb-0.5" />
              Login
            </Link>
          )}

          <button
            type="button"
            className="md:hidden text-slate-700 p-1"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>

      {/* Search — mobile */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="flex w-full rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#ff7a00]">
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none min-w-0"
            />
            <button
              type="submit"
              className="bg-[#ff7a00] text-white px-3"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile quick links */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
          <Link
            to="/wishlist"
            className="block text-sm font-medium text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Wishlist
            {wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>
          <Link
            to="/cart"
            className="block text-sm font-medium text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart
            {cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {token ? (
            <>
              <Link
                to="/orders"
                className="block text-sm font-medium text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/me"
                className="block text-sm font-medium text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-sm font-medium text-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Category nav */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 text-sm">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 font-medium shrink-0">
            <FaBars className="text-xs" />
            Categories
          </span>
          {categories.map((c) => (
            <Link
              key={c.name}
              to={c.path}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#ff7a00] hover:bg-orange-50 whitespace-nowrap transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}