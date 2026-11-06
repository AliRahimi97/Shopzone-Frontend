import api from "../components/axiosInstance";



const BaseURL = "https://shopzone-api-h8iv.onrender.com/api/orders";

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
            api.get("https://shopzone-api-h8iv.onrender.com/api/orders/admin/all", {
                headers: { Authorization: `Bearer ${token}` },
        }),
        updateStatus: (token, orderId, status) =>
            api.put(
                `https://shopzone-api-h8iv.onrender.com/api/orders/admin/${orderId}/status?status=${status}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
        ),
        
};
