const API_BASE = "http://localhost:8080";

export const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x400?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

export const getDiscountedPrice = (price, discountPercent = 0) =>
  Number(price) * (1 - (discountPercent || 0) / 100);

export const formatPrice = (value) => `$${Number(value).toFixed(2)}`;   