import { create } from "zustand";

export const useUserStore = create((set) => ({
    users: [],
    setUsers: (users) => set({ users }),

    fetchUsers: async () => {
        try {
            const res = await fetch("/api/auth/users");
            const { users } = await res.json();

            set({ users });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },
}));