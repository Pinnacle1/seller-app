import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Active Store Context
 * 
 * ZUSTAND RULES COMPLIANT:
 * - Only stores which store is currently active (ID + slug)
 * - No arrays, no server data, no loading states
 * - React Query handles the stores list
 */

type State = {
    activeStoreId: number | null;
    activeStoreSlug: string | null;
    activeStoreName: string | null;
    activeStoreLogo: string | null;
    isSwitching: boolean;
};

type Actions = {
    setActiveStore: (store: { id: number; slug: string; name: string; logo_url?: string | null }) => void;
    setSwitching: (switching: boolean) => void;
    clear: () => void;
};

const useActiveStoreStore = create<State & Actions>()(
    persist(
        (set) => ({
            // State
            activeStoreId: null,
            activeStoreSlug: null,
            activeStoreName: null,
            activeStoreLogo: null,
            isSwitching: false,

            // Actions
            setActiveStore: (store) =>
                set({
                    activeStoreId: store.id,
                    activeStoreSlug: store.slug,
                    activeStoreName: store.name,
                    activeStoreLogo: store.logo_url || null,
                }),

            setSwitching: (isSwitching) => set({ isSwitching }),

            clear: () =>
                set({
                    activeStoreId: null,
                    activeStoreSlug: null,
                    activeStoreName: null,
                    activeStoreLogo: null,
                    isSwitching: false,
                }),
        }),
        {
            name: "thriftzy-active-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useActiveStoreStore;
