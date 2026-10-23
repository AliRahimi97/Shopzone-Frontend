import { createContext, useEffect, useState } from "react";
import { parseJwt } from "../utils/JwtUtils";
import { ProductService } from "../service/ProductService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getAdminId = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const decoded = parseJwt(token);
      const raw = decoded?.userId ?? decoded?.id;
      const id = raw != null ? Number(raw) : null;
      return Number.isFinite(id) ? id : null;
    } catch {
      return null;
    }
  };

  const loadProducts = async () => {
    const token = getToken();
    if (!token) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await ProductService.getAll(token);
      setProducts(res.data || []);
    } catch (err) {
      console.error("loadProducts error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    const token = getToken();
    if (!token) throw new Error("Please login first");
    const res = await ProductService.getProduct(token, id);
    setCurrentProduct(res.data);
    return res.data;
  };

  const addImageToProduct = async (productId, imageFile, isPrimary = false) => {
    const token = getToken();
    if (!token) throw new Error("Please login first");
    await ProductService.addImage(token, productId, imageFile, isPrimary);
    return getProductById(productId);
  };

  const deleteImageFromProduct = async (imageId) => {
    const token = getToken();
    if (!token) throw new Error("Please login first");
    await ProductService.deleteImage(token, imageId);
    if (currentProduct) {
      const updated = await getProductById(currentProduct.productId);
      setCurrentProduct(updated);
    }
  };

  const fetchImages = async (productId) => {
    const token = getToken();
    if (!token) return [];
    const res = await ProductService.getImages(token, productId);
    return res.data;
  };

  const addProduct = async (data) => {
    const token = getToken();
    const adminId = getAdminId();
    if (!token || !adminId) throw new Error("Please login as admin");
    await ProductService.add(token, adminId, data);
    await loadProducts();
  };

  const deleteProduct = async (id) => {
    const token = getToken();
    if (!token) throw new Error("Please login first");
    await ProductService.delete(token, id);
    await loadProducts();
  };

  const updateProduct = async (id, data) => {
    const token = getToken();
    if (!token) throw new Error("Please login first");
    await ProductService.update(token, id, data);
    await loadProducts();
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    loadProducts();
    const onAuthChanged = () => loadProducts();
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        currentProduct,
        loading,
        filteredProducts,
        getProductById,
        addImageToProduct,
        deleteImageFromProduct,
        fetchImages,
        addProduct,
        deleteProduct,
        updateProduct,
        reloadProducts: loadProducts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};