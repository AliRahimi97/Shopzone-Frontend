import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const App = () => {
  const [theme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <WishlistProvider>
        <CartProvider>
          <ProductProvider>
            <AppRoutes />
          </ProductProvider>
        </CartProvider>
      </WishlistProvider>
    </div>
  );
};

export default App;