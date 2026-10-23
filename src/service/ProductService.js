import api from "../components/axiosInstance";


const BaseURL = "http://localhost:8080/api/products";

export const ProductService = {
    
    getAll: (token) => {
        return api.get(`${BaseURL}/all`, 
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
    },

    add: (token, adminId, data) => {
        return api.post(`${BaseURL}/add?adminId=${adminId}`, data, {
            headers: {Authorization: `Bearer ${token}`,
            "Content-Type":"multipart/form-data"}
        });
    },

    delete: (token, id) => {
        return api.delete(`${BaseURL}/delete/${id}`, {
            headers:{Authorization: `Bearer ${token}`}
        });
    },

    update: (token, id, data ) => {
        return api.put(`${BaseURL}/update/${id}`,data, {
            headers:{Authorization: `Bearer ${token}`}
        });
    },
    getProduct: (token, id) => {
        return api.get(`${BaseURL}/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    },
    discountProducts: (token, minPrice) => {
        return api.get(`${BaseURL}/discount?minPrice=${minPrice}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    hotProducts: (token, stock) => {
        return api.get(`${BaseURL}/hot?stock=${stock}`, {
            headers: {Authorization: `Bearer ${token}` }
        });
    },

    getProductByBrand: (token, brand) => {
        return api.get(`${BaseURL}/brand/${brand}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    },

    getProductByCategory: (token, category) => {
        return api.get(`${BaseURL}/category/${category}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    },


    /**
     * اضافه کردن یک عکس جدید به محصول موجود
     * @param {string} token - توکن کاربر
     * @param {number} productId - آیدی محصول
     * @param {File} imageFile - فایل عکس
     * @param {boolean} isPrimary - آیا این عکس اصلی باشه؟
     */

    addImage: (token, productId, imageFile, isPrimary = false) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("isPrimary", isPrimary);

        return api.post(`${BaseURL}/${productId}/images`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
    },

    /**
     * حذف یک عکس از گالری محصول
     * @param {string} token - توکن کاربر
     * @param {number} imageId - آیدی عکس (نه محصول)
     */
    deleteImage: (token, imageId) => {
        return api.delete(`${BaseURL}/images/${imageId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    /**
     * گرفتن تمام عکس‌های یک محصول (برای نمایش گالری در جزئیات)
     */
    getImages: (token, productId) => api.get(`${BaseURL}/${productId}/images`, {
        headers: { Authorization: `Bearer ${token}` }
    }),

    search: (token, q) => 
        api.get(`${BaseURL}/search`, {
            params: {q},
            headers: token ? {Authorization: `Bearer ${token}` } : {},
        }),
};