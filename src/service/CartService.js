import api from "../components/axiosInstance";



const BaseURL = "http://localhost:8080/api/cart";

export const CartService = {
    
    getCart: (token, userId) => 
        api.get(`${BaseURL}?userId=${userId}`, {
            headers: {Authorization: `Bearer ${token}`},
        }),

    addItem: (token, userId, productId, quantity = 1) =>
        api.post(`${BaseURL}/items?userId=${userId}`, 
            {productId, quantity}, 
            {
                headers: 
                { Authorization : `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        ),
    updateItem: (token, userId, cartItemId, quantity) =>
    api.put(
      `${BaseURL}/items/${cartItemId}?userId=${userId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ),

    removeItem: (token, userId, cartItemId) =>
        api.delete(`${BaseURL}/items/${cartItemId}?userId=${userId}`, {
            headers: {Authorization: `Bearer ${token}`},
        }
    ),

    clearCart: (token, userId) =>
    api.delete(`${BaseURL}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }
    ),
};