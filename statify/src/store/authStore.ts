import { create } from 'zustand';

type User = {
    id: string;
    email: string;
    username?: string;
    [k: string]: any
};

type AuthState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearAuth: () => set({ user: null }),
    isAuthenticated: () => !!get().user,
}));