"use client"

import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { DashboardStats } from "./components/DashboardStats"
import { RecentOrders } from "./components/RecentOrders"
import { QuickActions } from "./components/QuickActions"

export function HomeClient() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Seller</p>
        </div>
        <DashboardStats stats={[]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders orders={[]} />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  )
}
