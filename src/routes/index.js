import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import UserDetails from "../pages/UserDetails";
import ProductDetail from "../pages/shop/ProductDetail";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import EditOrder from "../pages/EditOrder";
import Messages from "../pages/Messages";
import Settings from "../pages/Settings";
import Register from "../pages/Register";
import MyProfilePage from "../pages/MyProfilePage";
import ProductPage from "../pages/admin/ProductPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import DefaultLayout from "../layouts/DefaultLayout";
import Mainpage from "../pages/shop/Mainpage";
import BrandProducts from "../pages/shop/BrandProducts";
import CategoryProducts from "../pages/shop/CategoryProducts";
import ProjectDashboard from "../pages/ProjectDashboard";
import CartPage from "../pages/shop/CartPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import OrderConfirmationPage from "../pages/shop/OrderConfirmationPage";
import OrderHistoryPage from "../pages/shop/OrderHistoryPage";
import OrderDetailPage from "../pages/shop/OrderDetailPage";
import ScrollToTop from "../components/ScrollToTop";
import SearchResults from "../pages/shop/SearchResults";
import WishlistPage from "../pages/shop/WishlistPage";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Mainpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/brand/:brand" element={<BrandProducts />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/project-dashboard" element={<ProjectDashboard />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          {/* Admin */}
          <Route element={<RoleRoute role="ADMIN" />}>
            <Route path="/admin" element={<DefaultLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/details/:id" element={<OrderDetails />} />
              <Route path="orders/edit/:id" element={<EditOrder />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Customer */}
          <Route element={<RoleRoute role="CUSTOMER" />}>
            <Route path="/me" element={<MyProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/order-confirmation/:id"
              element={<OrderConfirmationPage />}
            />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;