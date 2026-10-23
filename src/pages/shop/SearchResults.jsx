import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "../../components/ui/ProductCard";
import { ProductService } from "../../service/ProductService"; 

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await ProductService.search(token, q);
        if (!cancelled) {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Search failed. Please try again.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q, token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
          Search results
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {q ? (
            <>
              Showing results for{" "}
              <span className="font-semibold text-slate-800">&quot;{q}&quot;</span>
            </>
          ) : (
            "Type a keyword in the search bar"
          )}
        </p>

        {loading && (
          <p className="text-center py-16 text-slate-400">Searching...</p>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {!loading && !error && q && products.length === 0 && (
          <div className="text-center py-16">
            <FaSearch className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No products found</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Try another keyword or browse categories
            </p>
            <Link
              to="/"
              className="inline-flex bg-[#ff7a00] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              Back to home
            </Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.productId || p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}