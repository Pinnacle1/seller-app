"use client"

import { Card } from "@/component/ui/Card"

interface RecentOrder {
  id: string
  buyer: string
  items: string
  total: string
  status: string
}

interface RecentOrdersProps {
  orders: RecentOrder[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent orders</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{order.buyer}</p>
                <p className="text-xs text-muted-foreground">
                  {order.id} · {order.items}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-medium">{order.total}</p>
                <p
                  className={`text-xs ${order.status === "Pending" ? "text-yellow-500" : order.status === "Shipped" ? "text-blue-500" : "text-green-500"}`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
