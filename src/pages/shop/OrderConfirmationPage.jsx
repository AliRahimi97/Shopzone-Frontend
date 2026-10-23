import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaHome,
  FaListUl,
} from "react-icons/fa";
import { OrderService } from "../../service/OrderService";
import { parseJwt } from "../../utils/JwtUtils";
import Header from "./Header";
import Footer from "./Footer";
import { getImageUrl } from "../../utils/imageUtils";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let userId = null;
      try {
        const decoded = parseJwt(token);
        const raw =
          decoded?.userId ?? decoded?.id ?? decoded?.user_id ?? decoded?.sub;
        userId = raw != null ? Number(raw) : null;
      } catch {
        userId = null;
      }

      if (!userId || !id) {
        setError("Unable to load order");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await OrderService.getOrder(token, userId, id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Order not found"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading order...</p>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <Link to="/" className="text-[#ff7a00] font-semibold">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Success header */}
            <div className="bg-gradient-to-br from-emerald-50 to-white px-6 py-10 text-center border-b border-slate-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <FaCheckCircle className="text-3xl text-emerald-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                Order placed successfully!
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Thank you for your purchase. We’ve received your order.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-full">
                <FaBoxOpen />
                Order #{order?.orderId ?? id}
              </p>
            </div>

            {/* Order meta */}
            <div className="px-6 py-6 grid sm:grid-cols-3 gap-4 text-center sm:text-left border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="font-semibold text-slate-900">
                  {order?.status || "PAID"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Payment
                </p>
                <p className="font-semibold text-slate-900">
                  {order?.paymentMethod || "—"}
                  {order?.paymentStatus ? ` · ${order.paymentStatus}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Total
                </p>
                <p className="font-bold text-[#ff7a00] text-lg">
                  ${Number(order?.totalAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items */}
            {order?.items?.length > 0 && (
              <div className="px-6 py-6">
                <h2 className="font-bold text-slate-900 mb-4">Items ordered</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.orderItemId || item.productId}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-100"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/56?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Qty {item.quantity} × $
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        $
                        {Number(
                          item.lineTotal ?? item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-6 pb-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/orders/${order?.orderId ?? id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                <FaListUl />
                View Order Details
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition"
              >
                <FaHome />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}