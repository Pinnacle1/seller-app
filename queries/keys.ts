// Query key factory for consistent cache management
export const queryKeys = {
    // Stores
    stores: {
        all: ["stores"] as const,
        list: () => [...queryKeys.stores.all, "list"] as const,
    },

    // Dashboard
    dashboard: {
        all: ["dashboard"] as const,
        byStore: (storeId: number) => [...queryKeys.dashboard.all, storeId] as const,
    },

    // Orders
    orders: {
        all: ["orders"] as const,
        list: (storeId: number, params?: Record<string, unknown>) =>
            [...queryKeys.orders.all, storeId, params] as const,
        detail: (orderId: number) => [...queryKeys.orders.all, "detail", orderId] as const,
    },

    // Products
    products: {
        all: ["products"] as const,
        list: (storeId: number, params?: Record<string, unknown>) =>
            [...queryKeys.products.all, storeId, params] as const,
        detail: (productId: number) => [...queryKeys.products.all, "detail", productId] as const,
    },

    // Payouts
    payouts: {
        all: ["payouts"] as const,
        earnings: () => [...queryKeys.payouts.all, "earnings"] as const,
        history: (params?: Record<string, unknown>) =>
            [...queryKeys.payouts.all, "history", params] as const,
    },

    // Account
    account: {
        all: ["account"] as const,
        profile: () => [...queryKeys.account.all, "profile"] as const,
        kyc: () => [...queryKeys.account.all, "kyc"] as const,
        bank: () => [...queryKeys.account.all, "bank"] as const,
        addresses: () => [...queryKeys.account.all, "addresses"] as const,
    },

    // Reviews
    reviews: {
        all: ["reviews"] as const,
        list: (storeId: number, params?: Record<string, unknown>) =>
            [...queryKeys.reviews.all, storeId, params] as const,
        detail: (reviewId: number) => [...queryKeys.reviews.all, "detail", reviewId] as const,
    },
};
