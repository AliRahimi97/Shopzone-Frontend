import { createContext, useState, useEffect } from "react";
import { isTokenExpired, parseJwt } from "../utils/JwtUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //user id , email and role 
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const[loading, setLoading] = useState(true);
  //load user from token and refresh 
  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      logout();
      setLoading(false);
      return;
    }

    const decoded = parseJwt(token);

    setUser({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
    setIsAuthenticated(true);
    setLoading(false);
  }, []);
  //login function
  const login = (token) => {

    localStorage.setItem("token", token);
    const decoded = parseJwt(token);

    setUser({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    setIsAuthenticated(true);
  };

  //logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <AuthContext.Provider value={{user, role:user?.role, isAuthenticated,loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
