"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { OrderList } from "./components/OrderList"
import useActiveStoreStore from "@/store/active-store"
import { useOrdersQuery, useUpdateOrderStatus } from "@/queries/use-orders-query"
import { useStoresQuery } from "@/queries/use-stores-query"
import { OrderStatus, OrdersQueryParams } from "@/types/order"
import {
  RefreshCw,
  Download,
  Search,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  SlidersHorizontal
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"

interface OrdersClientProps {
  storeSlug: string
}

const filters = [
  { value: "all", label: "All", icon: ShoppingCart },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle },
  { value: "cancelled", label: "Canceled", icon: XCircle },
]

export function OrdersClient({ storeSlug }: OrdersClientProps) {
  const queryClient = useQueryClient()

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)
  const [queryParams, setQueryParams] = useState<Omit<OrdersQueryParams, 'store_id'>>({
    page: 1,
    limit: 20,
  })

  // Active store context (Zustand - UI state only)
  const { activeStoreId, setActiveStore, isSwitching } = useActiveStoreStore()

  // Stores list (React Query - server state)
  const { data: stores = [] } = useStoresQuery()

  // Find and set active store based on URL slug
  useEffect(() => {
    if (stores.length > 0) {
      const store = stores.find(s => s.slug === storeSlug)
      if (store && store.id !== activeStoreId) {
        setActiveStore({
          id: store.id,
          slug: store.slug,
          name: store.name,
          logo_url: store.logo_url,
        })
      }
    }
  }, [stores, storeSlug, activeStoreId, setActiveStore])

  // Orders data (React Query - server state)
  const {
    data: ordersData,
    isPending: isLoading,
    error,
    refetch,
  } = useOrdersQuery(activeStoreId, queryParams)

  // Update order mutation
  const updateOrderMutation = useUpdateOrderStatus()

  const orders = ordersData?.orders ?? []
  const pagination = ordersData?.pagination ?? { total: 0, page: 1, limit: 20 }
  const activeFilter = queryParams.status || "all"

  const handleFilterChange = (filter: string) => {
    const status = filter === "all" ? undefined : filter as OrderStatus
    setQueryParams(prev => ({ ...prev, status, page: 1 }))
  }

  const handleUpdateStatus = async (orderId: number, status: "shipped" | "delivered" | "cancelled") => {
    setUpdatingOrderId(orderId)
    try {
      await updateOrderMutation.mutateAsync({ orderId, data: { status } })
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
  }

  const clearError = () => {
    // With React Query, errors clear on refetch
    refetch()
  }

  const getCounts = () => {
    const counts: Record<string, number> = { all: pagination.total }
    orders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    return counts
  }

  const counts = getCounts()

  return (
    <DashboardLayout storeSlug={storeSlug}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">All Orders</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage and fulfill your orders
            </p>
          </div>
          {/* <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Export
          </button> */}
        </div>

        {/* Filter Tabs - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          {filters.map((f) => {
            const Icon = f.icon
            const count = f.value === "all" ? counts.all : (counts[f.value] || 0)
            const isActive = activeFilter === f.value

            return (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
                <span className="text-[10px] sm:text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Search & Filter Row */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar - Reduced Width */}
          <div className="relative flex-1 max-w-[200px] sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Sort */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Sort:</span>
            <button className="font-medium text-foreground hover:text-primary">Newest</button>
          </div>

          {/* Filter Button */}
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs sm:text-sm hover:bg-accent transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
            <p className="text-xs sm:text-sm text-destructive">{error.message}</p>
            <button onClick={clearError} className="text-xs text-destructive hover:underline">
              Retry
            </button>
          </div>
        )}

        {/* Order List */}
        <OrderList
          orders={orders}
          filter={activeFilter}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={updateOrderMutation.isPending}
          updatingOrderId={updatingOrderId}
          isLoading={isLoading || isSwitching}
        />

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground pt-2">
            <p>
              Showing {orders.length} of {pagination.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-50 text-xs"
                disabled={pagination.page <= 1}
                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page! - 1 }))}
              >
                Previous
              </button>
              <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium">
                {pagination.page}
              </span>
              <button
                className="px-3 py-1.5 rounded border border-border hover:bg-accent text-xs"
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => setQueryParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
