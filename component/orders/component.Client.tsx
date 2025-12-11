"use client"

import { useState } from "react"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { OrderList } from "./components/OrderList"
import { OrderDetailModal } from "./components/OrderDetailModal"

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
]

export function OrdersClient() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and fulfill orders</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors whitespace-nowrap ${activeFilter === f.value ? "bg-foreground text-background border-foreground" : "border-border hover:bg-accent"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <OrderList filter={activeFilter} onSelect={setSelectedOrder} />

        <OrderDetailModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </DashboardLayout>
  )
}
