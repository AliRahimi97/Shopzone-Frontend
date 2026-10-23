
import api from "../components/axiosInstance";

const BaseURL = "http://localhost:8080/api/wishlist";

export const WishlistService = {
    get: (token, userId) =>
        api.get(BaseURL, {
            params: {userId},
            headers: {Authorization: `Bearer ${token}` },
        }),
    add: (token, userId, productId) => 
        api.post(BaseURL, 
            { productId }, 
            {params: {userId}, 
                headers: {Authorization: `Bearer ${token}`
                },
        }
    ),
    remove: (token, userId, productId ) => 
        api.delete(`${BaseURL}/${productId}`,
            {
                params: {userId},
                headers: {Authorization: `Bearer ${token}`},
            }
        ),
    
    check: (token, userId, productId) => 
        api.get(`${BaseURL}/check`, {
            params:{ userId, productId },
            headers: {Authorization: `Bearer ${token}`},
        }),

};