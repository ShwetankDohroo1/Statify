// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err?.config;

        if (err?.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                useAuthStore.getState().clearAuth();
            } catch (e) {
            }
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);

export default api;
