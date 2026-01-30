import { create } from "zustand";
import type { Profile } from "@/app/layout.types";

type AdminStore = {
  users: Profile[];
  totalUsers: number;
  currentPage: number;
  setUsers: (users: Profile[], total: number) => void;
  setPage: (page: number) => void;
  updateUser: (id: string, updates: Partial<Profile>) => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  totalUsers: 0,
  currentPage: 1,
  setUsers: (users, total) => set({ users, totalUsers: total }),
  setPage: (page) => set({ currentPage: page }),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),
}));
