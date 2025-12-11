"use client"

import { Card } from "@/component/ui/Card"
import { TrendingUp, Package, ShoppingBag, Wallet } from "lucide-react"

const stats = [
  { label: "Today's Orders", value: "12", change: "+3", icon: ShoppingBag },
  { label: "Revenue (30d)", value: "₹45,230", change: "+12%", icon: TrendingUp },
  { label: "Total Products", value: "48", change: "3 low", icon: Package },
  { label: "Available Payout", value: "₹12,450", change: "Ready", icon: Wallet },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.change}</p>
        </Card>
      ))}
    </div>
  )
}
