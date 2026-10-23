import api from "../components/axiosInstance";

const BaseURL = "http://localhost:8080/api/users";

export const UserService = {
  getAllUsers: (token) =>
    api.get(`${BaseURL}/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    getUserById: (token, userId) =>
    api.get(`${BaseURL}/admin/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};