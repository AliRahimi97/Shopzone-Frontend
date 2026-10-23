import { createContext, useContext, useEffect, useState } from "react";
import { parseJwt } from "../utils/JwtUtils";
import { CartService } from "../service/CartService";

export const CartContext = createContext();

function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return { token: null, userId: null };
  }

  try {
    const decoded = parseJwt(token);
    const raw =
      decoded?.userId ??
      decoded?.id ??
      decoded?.user_id ??
      decoded?.sub ??
      null;

    const userId = raw != null && raw !== "" ? Number(raw) : null;

    return {
      token,
      userId: Number.isFinite(userId) ? userId : null,
    };
  } catch (e) {
    console.error("Failed to parse token", e);
    return { token: null, userId: null };
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    totalDiscount: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(false);

  const emptyCart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    totalDiscount: 0,
    total: 0,
  };

  const loadCart = async () => {
    const { token, userId } = getAuth();

    if (!token || !userId) {
      setCart(emptyCart);
      return;
    }

    try {
      setLoading(true);
      const res = await CartService.getCart(token, userId);
      setCart(res.data || emptyCart);
    } catch (err) {
      console.error("loadCart error:", err);
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { token, userId } = getAuth();

    console.log("addToCart auth:", { hasToken: !!token, userId });

    if (!token || !userId) {
      throw new Error("Please login first");
    }

    const res = await CartService.addItem(
      token,
      userId,
      Number(productId),
      Number(quantity)
    );

    setCart(res.data);
    return res.data;
  };

  const updateQuantity = async (cartItemId, quantity = 1) => {
    const { token, userId } = getAuth();
    if (!token || !userId) throw new Error("Please login first");

    const res = await CartService.updateItem(
      token,
      userId,
      cartItemId,
      Number(quantity)
    );
    setCart(res.data);
    return res.data;
  };

  const removeFromCart = async (cartItemId) => {
    const { token, userId } = getAuth();
    if (!token || !userId) throw new Error("Please login first");

    const res = await CartService.removeItem(token, userId, cartItemId);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) {
      setCart(emptyCart);
      return;
    }

    await CartService.clearCart(token, userId);
    setCart(emptyCart);
  };

  useEffect(() => {
      loadCart();
      const onAuthChanged = () => loadCart();
      window.addEventListener("auth-changed", onAuthChanged);
      return () => window.removeEventListener("auth-changed", onAuthChanged);
    }, 
  []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount: cart?.totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);