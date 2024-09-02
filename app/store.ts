import { create } from "zustand";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser;
  authenticatedTrue: () => void;
  authenticatedFalse: () => void;
  loadingTrue: () => void;
  loadingFalse: () => void;
  setUser: (newUser: AuthUser) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: { id: -1, username: "", email: "", avatar: "" },
  authenticatedTrue: () => {
    set({ isAuthenticated: true });
  },
  authenticatedFalse: () => {
    set({ isAuthenticated: false });
  },
  loadingTrue: () => {
    set({ isLoading: true });
  },
  loadingFalse: () => {
    set({ isLoading: false });
  },
  setUser: (newUser: AuthUser) => set(() => ({ user: newUser })),
}));
