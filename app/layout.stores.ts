import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "./layout.types";

type AuthStore = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ user: null, profile: null, isAuthenticated: false }),
}));

type ProfileMenuStore = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useProfileMenuStore = create<ProfileMenuStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

type SidebarStore = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

type ThemeStore = {
  isDark: boolean;
  toggle: () => void;
  setDark: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
  setDark: (isDark) => set({ isDark }),
}));
