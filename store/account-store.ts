"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/service/auth.service";
import { onboardService, StoreData, SellerProfile, SellerStats } from "@/service/onboard.service";
import { Bank } from "@/types/onboard";

interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

interface BankDetails {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
}

interface AccountState {
    user: UserData | null;
    store: StoreData | null;
    profile: SellerProfile | null;
    stats: SellerStats | null;
    bankDetails: BankDetails | null;

    isLoading: boolean;
    error: string | null;
}

interface AccountActions {
    fetchAccountData: () => Promise<void>;
    updateStore: (data: { name: string; description: string }) => Promise<boolean>;
    logout: () => Promise<void>;
}

const useAccountStore = create<AccountState & AccountActions>()(
    persist(
        (set, get) => ({
            user: null,
            store: null,
            profile: null,
            stats: null,
            bankDetails: null,
            isLoading: false,
            error: null,

            fetchAccountData: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Fetch User
                    const userRes = await authService.me();
                    if (!userRes.success || !userRes.data) {
                        set({
                            isLoading: false,
                            error: "Failed to fetch user data. Please try again."
                        });
                        return;
                    }
                    const user = userRes.data;

                    // 2. Fetch Store
                    let store: StoreData | null = null;
                    try {
                        const storeRes = await onboardService.getStores();
                        if (storeRes.success && storeRes.data && storeRes.data.length > 0) {
                            store = storeRes.data[0];
                        }
                    } catch (e) {
                        console.warn("Store fetch failed", e);
                    }

                    // 3. Fetch Dashboard Stats
                    let profile: SellerProfile | null = null;
                    let stats: SellerStats | null = null;
                    try {
                        const dashboardRes = await onboardService.getDashboard();
                        if (dashboardRes.success && dashboardRes.data) {
                            profile = dashboardRes.data.profile;
                            stats = dashboardRes.data.stats;
                        }
                    } catch (e) {
                        console.warn("Dashboard fetch failed", e);
                    }

                    // 4. Fetch Bank Details
                    let bankDetails: BankDetails | null = null;
                    try {
                        const bankRes = await onboardService.GetBank();
                        if (bankRes.success && bankRes.data) {
                            bankDetails = {
                                account_holder_name: bankRes.data.account_holder_name,
                                account_number: bankRes.data.account_number,
                                ifsc_code: bankRes.data.ifsc_code
                            };
                        }
                    } catch (e) {
                        console.warn("Bank fetch failed", e);
                    }

                    set({
                        user,
                        store,
                        profile,
                        stats,
                        bankDetails,
                        isLoading: false
                    });

                } catch (error: any) {
                    console.error("Account fetch error:", error);
                    set({
                        isLoading: false,
                        error: error.message || "Failed to fetch account data"
                    });
                    // Don't re-throw - let the UI handle the error state
                }
            },

            updateStore: async (data) => {
                const currentStore = get().store;
                if (!currentStore) return false;

                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.updateStore(currentStore.id, data);
                    if (response.success) {
                        set((state) => ({
                            store: state.store ? {
                                ...state.store,
                                name: data.name,
                                description: data.description
                            } : null,
                            isLoading: false
                        }));
                        return true;
                    } else {
                        set({ isLoading: false, error: response.message || "Failed to update store" });
                        return false;
                    }
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || "Failed to update store" });
                    return false;
                }
            },

            logout: async () => {
                await authService.logout();
                set({ user: null, store: null, profile: null, stats: null, bankDetails: null });
            }
        }),
        {
            name: "thriftzy-account",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                store: state.store,
                profile: state.profile,
                stats: state.stats,
                bankDetails: state.bankDetails
            })
        }
    )
);

export default useAccountStore;
