import axios from "axios";
import { isTokenExpired } from "../utils/JwtUtils";

const api = axios.create({
  baseURL: "https://shopzone-api-h8iv.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      const onLoginPage = window.location.pathname.includes("/login");
      if (!onLoginPage) {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Token expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
