import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { OrderService } from "../../service/OrderService";
import { useState } from "react";
import { parseJwt } from "../../utils/JwtUtils";
import Header from "./Header";
import Footer from "./Footer";
import { FaArrowLeft, FaCreditCard, FaLock, FaMoneyBill } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";



export default function CheckoutPage () {

    const navigate = useNavigate();
    const {cart, loadCart, cartCount } = useCart();
    const items = cart?.items || [];

    const [paymentMethod, setPaymentMethod] = useState("CARD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) return { token: null, userId: null };
        try {
        const decoded = parseJwt(token);
        const raw =
            decoded?.userId ?? decoded?.id ?? decoded?.user_id ?? decoded?.sub ?? null;
        const userId = raw != null ? Number(raw) : null;
        return {
            token,
            userId: Number.isFinite(userId) ? userId : null,
        };
        } catch {
        return { token: null, userId: null };
        }
    };

    const handlePlaceOrder = async () => {
        const { token , userId } = getAuth();
        if (!token || !userId) {
            navigate("/login");
            return;
        }

        if(!items.length) {
            setError("Your cart is empty");
            return;
        }

        try{
            setLoading(true);
            setError("");

            const res = await OrderService.checkout(token, userId, paymentMethod);
            await loadCart();
            const orderId = res.data?.orderId;
            if (orderId) {
                navigate(`/order-confirmation/${orderId}`);
            } else {
                navigate("/orders");
            }
        }catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Checkout failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    // Empty cart
    if (!items.length) {
        return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                Nothing to checkout
            </h1>
            <p className="text-slate-500 mb-6">Your cart is empty.</p>
            <Link
                to="/"
                className="inline-block bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-6 py-3 rounded-xl transition"
            >
                Continue Shopping
            </Link>
            </div>
            <Footer />
        </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#ff7a00] mb-6"
            >
            <FaArrowLeft /> Back to Cart
            </button>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Checkout
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Payment method */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Payment Method
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                    <button
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                        paymentMethod === "CARD"
                        ? "border-[#ff7a00] bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    >
                    <FaCreditCard className="text-[#ff7a00] text-xl shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-900">Card</p>
                        <p className="text-xs text-slate-500">Credit / Debit card</p>
                    </div>
                    </button>

                    <button
                    type="button"
                    onClick={() => setPaymentMethod("CASH")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                        paymentMethod === "CASH"
                        ? "border-[#ff7a00] bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    >
                    <FaMoneyBill className="text-emerald-600 text-xl shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-900">Cash</p>
                        <p className="text-xs text-slate-500">Pay on delivery</p>
                    </div>
                    </button>
                </div>
                </section>

                {/* Items */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Order Items ({cartCount})
                </h2>

                <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                    <div
                        key={item.cartItemId}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                        <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-100"
                        onError={(e) => {
                            e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                        />
                        <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                            {item.productName}
                        </p>
                        <p className="text-sm text-slate-500">
                            Qty {item.quantity} × $
                            {Number(item.finalPrice ?? item.price).toFixed(2)}
                        </p>
                        </div>
                        <p className="font-semibold text-slate-900 shrink-0">
                        ${Number(item.lineTotal).toFixed(2)}
                        </p>
                    </div>
                    ))}
                </div>
                </section>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${Number(cart.subtotal || 0).toFixed(2)}</span>
                    </div>

                    {Number(cart.totalDiscount) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-${Number(cart.totalDiscount).toFixed(2)}</span>
                    </div>
                    )}

                    <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>${Number(cart.total || 0).toFixed(2)}</span>
                    </div>
                </div>

                {error && (
                    <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
                )}

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-[#ff7a00] hover:bg-[#e56e00] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-orange-200/50"
                >
                    <FaLock className="text-sm" />
                    {loading ? "Placing order..." : "Place Order"}
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                    Your payment info is processed securely
                </p>
                </div>
            </div>
            </div>
        </main>

        <Footer />
        </div>
    );

}