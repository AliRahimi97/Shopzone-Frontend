import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductService } from "../../service/ProductService";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "../../components/ui/ProductCard";

const CategoryProducts = () => {
  const { category } = useParams();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    ProductService.getProductByCategory(token, category)
      .then((res) => setProducts(res.data || []))
      .catch((err) => {
        console.error(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, token]);

  const title = (category || "")
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-1">
            <Link to="/" className="hover:text-[#ff7a00]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">{title}</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {title} Products
          </h1>
          {!loading && (
            <p className="text-sm text-slate-500 mt-1">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-16">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="font-semibold text-slate-700 mb-2">
              No products in this category
            </p>
            <Link
              to="/"
              className="text-sm font-semibold text-[#ff7a00] hover:underline"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;