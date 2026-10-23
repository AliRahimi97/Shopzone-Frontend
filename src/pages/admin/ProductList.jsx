import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import EditProduct from "./EditProduct";
import { ProductContext } from "../../context/ProductContext";
import { ProductService } from "../../service/ProductService";

const API_BASE = "http://localhost:8080";
const PAGE_SIZE = 8;

const getImageUrl = (p) => {
  const url =
    p?.imageUrl ||
    p?.images?.find((i) => i.primaryImage)?.imageUrl ||
    p?.images?.[0]?.imageUrl;
  if (!url) return "https://via.placeholder.com/80x80?text=No+Img";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

const ProductList = () => {
  const {
    products,
    filteredProducts,
    deleteProduct,
    loading,
    searchQuery,
    setSearchQuery,
    getProductById,
  } = useContext(ProductContext);

  const [editItem, setEditItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  const categories = useMemo(() => {
    const set = new Set((products || []).map((p) => p.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [products]);

  const stats = useMemo(() => {
    const list = products || [];
    return {
      total: list.length,
      active: list.filter((p) => p.active).length,
      outOfStock: list.filter((p) => !p.stock || p.stock <= 0).length,
      lowStock: list.filter((p) => p.stock > 0 && p.stock <= 10).length,
    };
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = [...(filteredProducts || [])];

    if (categoryFilter !== "ALL") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (stockFilter === "IN") list = list.filter((p) => p.stock > 0);
    if (stockFilter === "OUT") list = list.filter((p) => !p.stock || p.stock <= 0);
    if (stockFilter === "LOW") list = list.filter((p) => p.stock > 0 && p.stock <= 10);
    if (statusFilter === "ACTIVE") list = list.filter((p) => p.active);
    if (statusFilter === "INACTIVE") list = list.filter((p) => !p.active);

    list.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "stock-asc":
          return (a.stock || 0) - (b.stock || 0);
        case "stock-desc":
          return (b.stock || 0) - (a.stock || 0);
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return list;
  }, [filteredProducts, categoryFilter, stockFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visibleProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openEdit = async (p) => {
    try {
      // load full product with images when possible
      if (getProductById) {
        const full = await getProductById(p.productId);
        setEditItem(full || p);
      } else {
        const res = await ProductService.getProduct(token, p.productId);
        setEditItem(res.data || p);
      }
    } catch {
      setEditItem(p);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await deleteProduct(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
        Loading products...
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: stats.total, icon: FaBoxOpen, color: "text-[#ff7a00] bg-orange-50" },
          { label: "Active", value: stats.active, icon: FaCheckCircle, color: "text-emerald-600 bg-emerald-50" },
          { label: "Out of Stock", value: stats.outOfStock, icon: FaTimesCircle, color: "text-red-500 bg-red-50" },
          { label: "Low Stock (≤10)", value: stats.lowStock, icon: FaBoxOpen, color: "text-amber-600 bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Product List</h2>
              <p className="text-xs text-slate-500">
                Showing {pageItems.length} of {visibleProducts.length} filtered products
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search name, brand, category..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a00]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All categories" : c}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="ALL">All stock</option>
              <option value="IN">In stock</option>
              <option value="LOW">Low stock</option>
              <option value="OUT">Out of stock</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="ALL">All status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="price-asc">Price low → high</option>
              <option value="price-desc">Price high → low</option>
              <option value="stock-asc">Stock low → high</option>
              <option value="stock-desc">Stock high → low</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Brand</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    No products match your filters
                  </td>
                </tr>
              ) : (
                pageItems.map((p) => {
                  const out = !p.stock || p.stock <= 0;
                  const low = p.stock > 0 && p.stock <= 10;
                  return (
                    <tr
                      key={p.productId}
                      className="border-b border-slate-50 hover:bg-orange-50/40 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img
                            src={getImageUrl(p)}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/80x80?text=No+Img";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-slate-400">#{p.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 text-slate-600">{p.brand}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ${Number(p.price || 0).toFixed(2)}
                        {p.discountPercent > 0 && (
                          <span className="ml-2 text-xs text-red-500 font-medium">
                            -{p.discountPercent}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            out
                              ? "bg-red-50 text-red-600"
                              : low
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {out ? "Out of stock" : low ? `Low (${p.stock})` : p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${p.productId}`}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#ff7a00] hover:border-orange-200"
                            title="View"
                          >
                            <FaEye className="text-xs" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200"
                            title="Edit"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === p.productId}
                            onClick={() => handleDelete(p.productId, p.name)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                            title="Delete"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editItem && (
        <EditProduct product={editItem} onClose={() => setEditItem(null)} />
      )}
    </>
  );
};

export default ProductList;