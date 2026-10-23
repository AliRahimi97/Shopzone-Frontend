import { useContext, useMemo, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { ProductService } from "../../service/ProductService";
import { parseJwt } from "../../utils/JwtUtils";
import { FaCloudUploadAlt, FaTimes, FaCheckCircle } from "react-icons/fa";

const CATEGORIES = [
  "ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "BEAUTY",
  "TOYS", "SPORTS", "FOOD", "FURNITURE",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  discountPercent: "0",
};

const fieldClass =
  "w-full border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#ff7a00] transition";

const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

const AddProduct = () => {
  const { reloadProducts } = useContext(ProductContext);
  const [formData, setFormData] = useState(emptyForm);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [open, setOpen] = useState(true);

  const token = localStorage.getItem("token");
  const adminId = useMemo(() => {
    try {
      return parseJwt(token)?.userId;
    } catch {
      return null;
    }
  }, [token]);

  const primaryPreview = primaryImage ? URL.createObjectURL(primaryImage) : null;
  const galleryPreviews = galleryFiles.map((f) => ({
    file: f,
    url: URL.createObjectURL(f),
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrimaryChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPrimaryImage(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryFiles((prev) => [...prev, ...files].slice(0, 8));
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setPrimaryImage(null);
    setGalleryFiles([]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!adminId) {
      setMessage({ type: "error", text: "Admin session not found. Please login again." });
      return;
    }
    if (!primaryImage) {
      setMessage({ type: "error", text: "Primary image is required." });
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("discountPercent", formData.discountPercent || "0");
      data.append("image", primaryImage);

      const res = await ProductService.add(token, adminId, data);
      const created = res.data;
      const productId = created?.productId || created?.id;

      if (!productId) throw new Error("Product created but productId missing in response");

      for (const file of galleryFiles) {
        await ProductService.addImage(token, productId, file, false);
      }

      if (reloadProducts) await reloadProducts();
      resetForm();
      setMessage({
        type: "success",
        text: `Product #${productId} created${
          galleryFiles.length ? ` with ${galleryFiles.length + 1} images` : ""
        }.`,
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Failed to add product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
      {/* Header / collapse */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
      >
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Add New Product</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary image required · Optional gallery (max 8)
          </p>
        </div>
        <span className="text-xs font-semibold text-[#ff7a00]">
          {open ? "Hide form" : "Show form"}
        </span>
      </button>

      {open && (
        <form onSubmit={submit} className="px-6 pb-6 border-t border-slate-100">
          {message.text && (
            <div
              className={`mt-4 mb-2 rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" && <FaCheckCircle className="mt-0.5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Left: images */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Primary image *</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-5 cursor-pointer hover:border-[#ff7a00] hover:bg-orange-50/40 transition min-h-[180px]">
                  {primaryPreview ? (
                    <img
                      src={primaryPreview}
                      alt="Primary"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <FaCloudUploadAlt className="text-3xl text-slate-300" />
                      <span className="text-xs text-slate-500 text-center">
                        Click to upload main photo
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>Gallery images (optional)</label>
                <label className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-[#ff7a00] text-sm text-slate-600 transition">
                  <FaCloudUploadAlt className="text-[#ff7a00]" />
                  Add extra images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </label>

                {galleryPreviews.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {galleryPreviews.map((g, i) => (
                      <div key={i} className="relative">
                        <img
                          src={g.url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryFile(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: fields */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product name *</label>
                <input name="name" value={formData.name} onChange={handleChange} className={fieldClass} required />
              </div>

              <div>
                <label className={labelClass}>Brand *</label>
                <input name="brand" value={formData.brand} onChange={handleChange} className={fieldClass} required />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className={fieldClass} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Price *</label>
                <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} className={fieldClass} required />
              </div>

              <div>
                <label className={labelClass}>Stock *</label>
                <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} className={fieldClass} required />
              </div>

              <div>
                <label className={labelClass}>Discount %</label>
                <input name="discountPercent" type="number" min="0" max="100" value={formData.discountPercent} onChange={handleChange} className={fieldClass} />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="Short product description..."
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e56e00] text-white text-sm font-semibold disabled:opacity-60 transition"
            >
              {loading ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProduct;