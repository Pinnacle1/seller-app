// Utility hooks
export { useIsMobile } from "./use-mobile"
export { useToast } from "./use-toast"

// Re-export utilities
export { handleError } from "./utils/handle-error"

// NOTE: Domain-specific data hooks have been moved to React Query
// Import from @/queries instead:
// - useDashboardQuery
// - useOrdersQuery, useUpdateOrderStatus
// - useProductsQuery, useCreateProduct, useUpdateProduct, useDeleteProduct
// - useEarningsQuery, usePayoutsQuery, useRequestPayout
// - useSellerProfileQuery, useKycStatusQuery, useBankDetailsQuery
// - useStoresQuery, useCreateStore
