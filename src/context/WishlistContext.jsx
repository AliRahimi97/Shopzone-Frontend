import { createContext, useContext, useEffect, useState } from "react";
import { parseJwt } from "../utils/JwtUtils";
import { WishlistService } from "../service/WishlistService";

const WishlistContext = createContext(null);

function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) return { token: null, userId: null };
  try {
    const decoded = parseJwt(token);
    const raw = decoded?.userId ?? decoded?.id ?? decoded?.sub;
    const userId = raw != null && !Number.isNaN(Number(raw)) ? Number(raw) : null;
    return { token, userId };
  } catch {
    return { token: null, userId: null };
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await WishlistService.get(token, userId);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist(); // یا loadCart

    const onAuthChanged = () => {
        loadWishlist(); // بدون token → داخل load، setItems([])
    };
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
    }, []);

  const addToWishlist = async (productId) => {
    const { token, userId } = getAuth();
    if (!token || !userId) throw new Error("Please login first");
    const res = await WishlistService.add(token, userId, productId);
    setItems(res.data);
    return res.data;
  };

  const removeFromWishlist = async (productId) => {
    const { token, userId } = getAuth();
    if (!token || !userId) {
        setItems([]);
        throw new Error("Please login first");
        
    }
    const res = await WishlistService.remove(token, userId, productId);
    setItems(res.data);
    return res.data;
  };

  const toggleWishlist = async (productId) => {
    const exists = items.some((i) => i.productId === productId);
    if (exists) return removeFromWishlist(productId);
    return addToWishlist(productId);
  };

  const isInWishlist = (productId) =>
    items.some((i) => i.productId === productId);

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};