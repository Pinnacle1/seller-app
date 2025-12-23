"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Loader2, Store, AlertCircle } from "lucide-react"
import { Button } from "@/component/ui/Button"
import useActiveStoreStore from "@/store/active-store"
import { useDashboardQuery } from "@/queries/use-dashboard-query"
import { useStoresQuery } from "@/queries/use-stores-query"

// Components
import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardAlerts } from "./components/DashboardAlerts"
import { MetricsGrid } from "./components/MetricsGrid"
import { OrderStatusOverview } from "./components/OrderStatusOverview"
import { RecentOrdersList } from "./components/RecentOrdersList"
import { InventoryStatus } from "./components/InventoryStatus"
import { QuickActions } from "./components/QuickActions"

interface HomeClientProps {
  storeSlug: string
}

export function HomeClient({ storeSlug }: HomeClientProps) {
  const router = useRouter()

  // Active store context (Zustand - UI state only)
  const { activeStoreId, activeStoreName, setActiveStore, isSwitching } = useActiveStoreStore()

  // Stores list (React Query - server state)
  const { data: stores = [], isPending: storesLoading } = useStoresQuery()

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

  // Dashboard data (React Query - server state)
  const {
    data,
    isPending: dashboardLoading,
    error: dashboardError
  } = useDashboardQuery(activeStoreId)

  // Show loading when: stores loading, dashboard loading, or switching stores
  if (storesLoading || dashboardLoading || isSwitching) {
    return (
      <DashboardLayout storeSlug={storeSlug}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (dashboardError) {
    return (
      <DashboardLayout storeSlug={storeSlug}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h2 className="text-xl font-semibold">Error</h2>
          <p className="text-sm text-muted-foreground">{dashboardError.message}</p>
          <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout storeSlug={storeSlug}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Store className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No Data</h2>
          <p className="text-sm text-muted-foreground">No dashboard data available</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout storeSlug={storeSlug}>
      <div className="space-y-6">
        <DashboardHeader storeName={activeStoreName ?? undefined} storeSlug={storeSlug} />
        <DashboardAlerts alerts={data.alerts} />
        <MetricsGrid
          monthRevenue={data.monthRevenue}
          totalOrders={data.totalOrders}
          totalProducts={data.totalProducts}
          pendingPayouts={data.pendingPayouts}
        />
        <OrderStatusOverview
          pendingOrders={data.pendingOrders}
          shippedOrders={data.shippedOrders}
          deliveredOrders={data.deliveredOrders}
          cancelledOrders={data.cancelledOrders}
          storeSlug={storeSlug}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrdersList orders={data.recentOrders} storeSlug={storeSlug} />
          <InventoryStatus
            totalProducts={data.totalProducts}
            lowStockProducts={data.lowStockProducts}
            outOfStockProducts={data.outOfStockProducts}
            topProducts={data.topProducts}
            storeSlug={storeSlug}
          />
        </div>
        <QuickActions storeSlug={storeSlug} />
      </div>
    </DashboardLayout>
  )
}
