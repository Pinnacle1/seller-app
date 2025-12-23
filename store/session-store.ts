import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Session Store
 * 
 * ZUSTAND RULES COMPLIANT:
 * - Only stores auth/session info
 * - No server data, no loading states
 * - React Query handles profile data fetching
 */

type State = {
    sellerId: number | null;
    email: string | null;
    isAuthenticated: boolean;
};

type Actions = {
    setSession: (sellerId: number, email: string) => void;
    logout: () => void;
};

const useSessionStore = create<State & Actions>()(
    persist(
        (set) => ({
            // State
            sellerId: null,
            email: null,
            isAuthenticated: false,

            // Actions
            setSession: (sellerId, email) =>
                set({ sellerId, email, isAuthenticated: true }),

            logout: () =>
                set({ sellerId: null, email: null, isAuthenticated: false }),
        }),
        {
            name: "thriftzy-session",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSessionStore;
