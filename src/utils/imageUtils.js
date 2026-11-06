const API_BASE = "https://shopzone-api-h8iv.onrender.com";

export const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x400?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

export const getDiscountedPrice = (price, discountPercent = 0) =>
  Number(price) * (1 - (discountPercent || 0) / 100);

export const formatPrice = (value) => `$${Number(value).toFixed(2)}`;   
