import { create } from "zustand";

/**
 * UI Store
 * 
 * ZUSTAND RULES COMPLIANT:
 * - Only stores global UI state
 * - No server data, no loading states
 */

type ModalType =
    | null
    | "add-product"
    | "payout-request"
    | "confirm-delete"
    | "order-details";

type State = {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    activeModal: ModalType;
    modalData: unknown;
};

type Actions = {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
    openModal: (modal: ModalType, data?: unknown) => void;
    closeModal: () => void;
};

const useUIStore = create<State & Actions>((set) => ({
    // State
    sidebarOpen: true,
    mobileMenuOpen: false,
    activeModal: null,
    modalData: null,

    // Actions
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    openModal: (activeModal, modalData = null) => set({ activeModal, modalData }),
    closeModal: () => set({ activeModal: null, modalData: null }),
}));

export default useUIStore;
