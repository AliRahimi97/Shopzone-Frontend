import { API_BASE_URL } from "../env-config.ts";

// گرفتن اطلاعات کاربر
export const getUserInfo = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    // توکن منقضی یا کاربر لاگین نیست
    window.location.href = "/login";
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  return response.json();
};
