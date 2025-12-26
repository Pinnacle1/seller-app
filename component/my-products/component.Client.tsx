"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { ProductList } from "./components/ProductList"
import { Button } from "@/component/ui/Button"
import { Plus, Search, Loader2, RefreshCw, Trash } from "lucide-react"
import useActiveStoreStore from "@/store/active-store"
import { useProductsQuery, useDeleteProduct, useBulkDeleteProducts } from "@/queries/use-products-query"
import { useStoresQuery } from "@/queries/use-stores-query"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"
import { ProductsQueryParams } from "@/types/product"

interface MyProductsClientProps {
  storeSlug: string
}

type FilterValue = "all" | "low-stock"

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low-stock", label: "Low Stock" },
]

export function MyProductsClient({ storeSlug }: MyProductsClientProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Local UI state
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [queryParams, setQueryParams] = useState<Omit<ProductsQueryParams, 'store_id'>>({
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

  // Products data (React Query - server state)
  const {
    data: productsData,
    isPending: isLoading,
    error,
  } = useProductsQuery(activeStoreId, queryParams)

  // Mutations
  const deleteProductMutation = useDeleteProduct()
  const bulkDeleteMutation = useBulkDeleteProducts()

  const products = productsData?.products ?? []
  const pagination = productsData?.pagination ?? { total: 0, page: 1, limit: 20 }

  // Compute counts from products array (memoized to prevent re-renders)
  const counts = useMemo(() => ({
    all: products.length,
    lowStock: products.filter(p => p.quantity <= 5).length,
  }), [products])

  // Show/hide bulk actions based on selection
  const showBulkActions = selectedIds.length > 0

  // Handle filter change
  const handleFilterChange = useCallback((filter: FilterValue) => {
    setActiveFilter(filter)
    setQueryParams(prev => ({ ...prev, page: 1 }))
  }, [])

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setQueryParams(prev => ({ ...prev, page: 1 }))
  }, [])

  // Handle edit
  const handleEdit = useCallback((id: string) => {
    router.push(`/${storeSlug}/edit-product/${id}`)
  }, [router, storeSlug])

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProductMutation.mutateAsync(Number(id))
    }
  }, [deleteProductMutation])

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      await bulkDeleteMutation.mutateAsync(selectedIds)
      setSelectedIds([])
    }
  }, [bulkDeleteMutation, selectedIds])

  // Selection handlers
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedIds([])
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  }, [queryClient])

  // Filter products for low-stock (client-side)
  const filteredProducts = useMemo(() => {
    return activeFilter === "low-stock"
      ? products.filter(p => p.quantity <= 5)
      : products
  }, [products, activeFilter])

  const isDeleting = deleteProductMutation.isPending || bulkDeleteMutation.isPending

  return (
    <DashboardLayout storeSlug={storeSlug}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your product listings ({counts.all} total)
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => router.push(`/${storeSlug}/upload-product`)}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div> */}
        </div>

        {/* Search Bar */}
        {/* <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-input border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/50"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form> */}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors whitespace-nowrap flex items-center gap-2 ${activeFilter === f.value
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:bg-accent"
                }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f.value
                ? "bg-background/20 text-background"
                : "bg-muted text-muted-foreground"
                }`}>
                {f.value === "all" ? counts.all : counts.lowStock}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg">
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
            >
              Deselect All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
            <p className="text-sm text-destructive">{error.message}</p>
            <button
              onClick={handleRefresh}
              className="text-xs text-destructive hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading || isSwitching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Product List */}
            <ProductList
              products={filteredProducts}
              filter={activeFilter}
              selectedIds={selectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleSelect={toggleSelection}
              isLoading={isLoading}
            />

            {/* Pagination Info */}
            {pagination.total > 0 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <span className="text-sm text-muted-foreground">
                  Showing {products.length} of {pagination.total} products
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
