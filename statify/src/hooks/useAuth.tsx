// src/hooks/useAuth.ts
'use client';

import { useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
    const setUser = useAuthStore((s) => s.setUser);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const login = useCallback(
        async (email: string, password: string) => {
            const res = await api.post('/auth/login', { values: { email, password } });
            const { user } = res.data;
            setUser(user || null);
            return res.data;
        },
        [setUser]
    );

    const getProfile = useCallback(async () => {
        try {
            const res = await api.get('/auth/me');console.log(res);
            
            const user = res.data?.username ?? null;
            setUser(user);
            return user;
        } catch (err) {
            setUser(null);
            return null;
        }
    }, [setUser]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
        }
        clearAuth();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }, [clearAuth]);

    return { login, getProfile, logout };
};

export default useAuth;
