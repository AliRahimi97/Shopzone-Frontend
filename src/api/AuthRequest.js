import axios from "axios";

import { API_BASE_URL } from "../env-config.ts";

export const customerRegister = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register/customer`, formData);
    return response.data;
}

export const adminRegister = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register/admin`, formData);
    return response.data;
}

export const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
    });
    return response.data;
}