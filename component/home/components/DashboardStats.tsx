"use client"

import { Card } from "@/component/ui/Card"
import { TrendingUp, Package, ShoppingBag, Wallet } from "lucide-react"

interface Stat {
  label: string
  value: string
  change: string
  icon: any
}

interface DashboardStatsProps {
  stats: Stat[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
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
