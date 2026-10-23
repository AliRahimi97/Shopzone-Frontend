import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductService } from "../../service/ProductService";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "../../components/ui/ProductCard";

const BrandProducts = () => {
  const { brand } = useParams();
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ProductService.getProductByBrand(token, brand)
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-1">
            <Link to="/" className="hover:text-[#ff7a00]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">{brand}</span>
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {brand} Products
          </h1>
          <p className="text-slate-500 mt-1">{products.length} products found</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-4">No products for this brand</p>
            <Link to="/" className="text-[#ff7a00] font-semibold hover:underline">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

export default BrandProducts;