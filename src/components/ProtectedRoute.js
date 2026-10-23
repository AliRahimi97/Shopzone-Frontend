import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
