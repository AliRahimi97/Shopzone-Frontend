import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { ProductService } from "../../service/ProductService";
import { FaTimes, FaTrash, FaCloudUploadAlt } from "react-icons/fa";

const CATEGORIES = [
  "ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "BEAUTY",
  "TOYS", "SPORTS", "FOOD", "FURNITURE",
];

const API_BASE = "http://localhost:8080";
const fieldClass =
  "w-full border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#ff7a00] transition";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/160x160?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

const EditProduct = ({ product, onClose }) => {
  const { updateProduct, reloadProducts } = useContext(ProductContext);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    discountPercent: 0,
    active: true,
  });
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category: product.category || "",
      brand: product.brand || "",
      discountPercent: product.discountPercent ?? 0,
      active: product.active ?? true,
    });

    if (product.images?.length) {
      setImages(product.images);
      const primary = product.images.find((i) => i.primaryImage) || product.images[0];
      setPreview(getImageUrl(primary.imageUrl));
    } else if (product.imageUrl) {
      setImages([]);
      setPreview(getImageUrl(product.imageUrl));
    } else {
      setImages([]);
      setPreview("");
    }

    setSelectedImage(null);
    setNewGalleryFiles([]);
    setMessage({ type: "", text: "" });
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrimaryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleNewGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewGalleryFiles((prev) => [...prev, ...files].slice(0, 8));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      setLoading(true);
      await ProductService.deleteImage(token, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setMessage({ type: "success", text: "Image deleted." });
      if (reloadProducts) await reloadProducts();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete image." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("discountPercent", formData.discountPercent ?? 0);
      data.append("active", formData.active);
      if (selectedImage) data.append("image", selectedImage);

      await updateProduct(product.productId, data);

      for (const file of newGalleryFiles) {
        await ProductService.addImage(token, product.productId, file, false);
      }

      if (reloadProducts) await reloadProducts();
      setMessage({ type: "success", text: "Product updated successfully." });
      setTimeout(() => onClose?.(), 450);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Update failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Edit Product</h2>
            <p className="text-xs text-slate-500">#{product.productId} · {product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message.text && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Images column */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className={labelClass}>Primary preview</label>
                <img
                  src={preview || "https://via.placeholder.com/240x240?text=No+Image"}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-2xl border border-slate-200"
                />
                <label className="mt-2 flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-[#ff7a00] text-sm text-slate-600">
                  <FaCloudUploadAlt className="text-[#ff7a00]" />
                  Replace primary image
                  <input type="file" accept="image/*" onChange={handlePrimaryFileChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className={labelClass}>Current gallery</label>
                {images.length === 0 ? (
                  <p className="text-xs text-slate-400">No gallery images</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {images.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={getImageUrl(img.imageUrl)}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        {img.primaryImage && (
                          <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-[#ff7a00] text-white px-1 rounded">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleDeleteExistingImage(img.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <FaTrash className="text-[9px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Add gallery images</label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl px-3 py-3 cursor-pointer hover:border-[#ff7a00] text-sm text-slate-600">
                  <FaCloudUploadAlt className="text-[#ff7a00]" />
                  Upload extra images
                  <input type="file" accept="image/*" multiple onChange={handleNewGalleryChange} className="hidden" />
                </label>
                {newGalleryFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newGalleryFiles.map((file, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-14 h-14 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setNewGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fields column */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              <div className="sm:col-span-2">
                <label className={labelClass}>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className={fieldClass} required />
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} className={fieldClass} required />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={fieldClass} required>
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Price</label>
                <input type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} className={fieldClass} required />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange} className={fieldClass} required />
              </div>
              <div>
                <label className={labelClass}>Discount %</label>
                <input type="number" name="discountPercent" min="0" max="100" value={formData.discountPercent} onChange={handleChange} className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={String(formData.active)}
                  onChange={(e) => setFormData((p) => ({ ...p, active: e.target.value === "true" }))}
                  className={fieldClass}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className={fieldClass} />
              </div>
            </div>
          </div>

          {/* Sticky footer actions */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 -mx-6 px-6 py-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#ff7a00] hover:bg-[#e56e00] disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;