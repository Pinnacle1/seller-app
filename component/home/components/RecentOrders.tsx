"use client"

import { Card } from "@/component/ui/Card"

const orders = [
  { id: "#1234", buyer: "Rahul M.", items: "2 items", total: "₹1,250", status: "Pending" },
  { id: "#1233", buyer: "Priya S.", items: "1 item", total: "₹850", status: "Shipped" },
  { id: "#1232", buyer: "Amit K.", items: "3 items", total: "₹2,100", status: "Delivered" },
  { id: "#1231", buyer: "Sneha R.", items: "1 item", total: "₹450", status: "Pending" },
  { id: "#1230", buyer: "Vikram T.", items: "2 items", total: "₹1,800", status: "Shipped" },
]

export function RecentOrders() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.map((order) => (
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
        ))}
      </div>
    </Card>
  )
}
