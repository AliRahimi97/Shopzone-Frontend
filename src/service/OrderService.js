import api from "../components/axiosInstance";



const BaseURL = "http://localhost:8080/api/orders";

export const OrderService = {
    checkout: (token, userId, paymentMethod = "CARD") => 
        api.post(`${BaseURL}/checkout?userId=${userId}`,
            {paymentMethod},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
            },
        }
        ),
        getMyOrders: (token, userId) =>
            api.get(`${BaseURL}?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            }
        ),
        getOrder: (token, userId, orderId) =>
            api.get(`${BaseURL}/${orderId}?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            }
        ),
        getAllOrders: (token) =>
            api.get("http://localhost:8080/api/orders/admin/all", {
                headers: { Authorization: `Bearer ${token}` },
        }),
        updateStatus: (token, orderId, status) =>
            api.put(
                `http://localhost:8080/api/orders/admin/${orderId}/status?status=${status}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
        ),
        
};