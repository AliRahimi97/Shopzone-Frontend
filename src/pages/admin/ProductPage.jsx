import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import { AuthContext } from "../../context/AuthContext";
import { ProductProvider } from "../../context/ProductContext";

const ProductPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  return (
    <ProductProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <p className="text-sm text-[#ff7a00] font-semibold mb-1">Admin</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Product Management</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Create, edit, search, and manage your product catalog
            </p>
          </div>

          <AddProduct />
          <ProductList />
        </div>
      </div>
    </ProductProvider>
  );
};

export default ProductPage;