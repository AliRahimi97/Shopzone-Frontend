import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import { getImageUrl, formatPrice } from "../../utils/imageUtils";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, cartCount } =
    useCart();

  const items = cart?.items || [];

  const handleQuantity = async (cartItemId, currentQty, delta, stock) => {
    const next = currentQty + delta;
    if (next < 1) return;
    if (stock != null && next > stock) {
      alert("Not enough stock");
      return;
    }
    try {
      await updateQuantity(cartItemId, next);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    try {
      await removeFromCart(cartItemId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
          Loading cart...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition"
          >
            <FaArrowLeft className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
              <FaShoppingBag className="text-3xl text-[#ff7a00]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex gap-4"
                >
                  <Link
                    to={`/products/${item.productId}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100"
                  >
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="w-full h-full object-contain p-2"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        {item.brand && (
                          <p className="text-xs font-medium text-[#ff7a00] uppercase tracking-wide">
                            {item.brand}
                          </p>
                        )}
                        <Link
                          to={`/products/${item.productId}`}
                          className="font-semibold text-slate-900 hover:text-[#ff7a00] line-clamp-2"
                        >
                          {item.productName}
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-sm flex-wrap">
                          {item.discountPercent > 0 ? (
                            <>
                              <span className="text-slate-400 line-through">
                                {formatPrice(item.price)}
                              </span>
                              <span className="font-bold text-slate-900">
                                {formatPrice(item.finalPrice)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                                -{item.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-slate-900">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.cartItemId)}
                        className="text-slate-400 hover:text-red-500 p-2 h-fit rounded-lg hover:bg-red-50 transition"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(
                              item.cartItemId,
                              item.quantity,
                              -1,
                              item.stock
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(
                              item.cartItemId,
                              item.quantity,
                              1,
                              item.stock
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <p className="font-bold text-slate-900">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal || 0)}</span>
                  </div>
                  {cart.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(cart.total || 0)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold py-3.5 rounded-xl transition shadow-md shadow-orange-200"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="mt-3 block text-center text-sm text-slate-500 hover:text-[#ff7a00]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}