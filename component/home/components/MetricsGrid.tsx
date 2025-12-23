"use client"

import { Card } from "@/component/ui/Card"
import { IndianRupee, ShoppingBag, Package, Wallet } from "lucide-react"

interface MetricsGridProps {
    monthRevenue: number
    totalOrders: number
    totalProducts: number
    pendingPayouts: number
}

export function MetricsGrid({ monthRevenue, totalOrders, totalProducts, pendingPayouts }: MetricsGridProps) {
    const metrics = [
        {
            label: "Total Revenue",
            value: `₹${monthRevenue.toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: "green"
        },
        {
            label: "Total Orders",
            value: totalOrders,
            icon: ShoppingBag,
            color: "blue"
        },
        {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "purple"
        },
        {
            label: "Pending Payouts",
            value: `₹${pendingPayouts.toLocaleString('en-IN')}`,
            icon: Wallet,
            color: "amber"
        }
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; gradient: string }> = {
            green: { bg: "bg-green-500/10", gradient: "from-green-500/10" },
            blue: { bg: "bg-blue-500/10", gradient: "from-blue-500/10" },
            purple: { bg: "bg-purple-500/10", gradient: "from-purple-500/10" },
            amber: { bg: "bg-amber-500/10", gradient: "from-amber-500/10" }
        }
        return colors[color] || colors.green
    }

    const getIconColor = (color: string) => {
        const colors: Record<string, string> = {
            green: "text-green-500",
            blue: "text-blue-500",
            purple: "text-purple-500",
            amber: "text-amber-500"
        }
        return colors[color] || "text-green-500"
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
                const Icon = metric.icon
                const colorClasses = getColorClasses(metric.color)

                return (
                    <Card key={metric.label} className="relative overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-10 h-10 rounded-xl ${colorClasses.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${getIconColor(metric.color)}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{metric.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                        </div>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses.gradient} to-transparent rounded-bl-full`} />
                    </Card>
                )
            })}
        </div>
    )
}
