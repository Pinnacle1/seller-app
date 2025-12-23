"use client"

import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { ArrowRight, Clock, Truck, XCircle, PackageCheck } from "lucide-react"
import Link from "next/link"

interface OrderStatusOverviewProps {
    pendingOrders: number
    shippedOrders: number
    deliveredOrders: number
    cancelledOrders: number
    storeSlug: string
}

export function OrderStatusOverview({
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    storeSlug
}: OrderStatusOverviewProps) {
    const statuses = [
        {
            label: "Pending",
            count: pendingOrders,
            icon: Clock,
            color: "yellow",
            href: `/${storeSlug}/orders?status=pending`
        },
        {
            label: "Shipped",
            count: shippedOrders,
            icon: Truck,
            color: "purple",
            href: `/${storeSlug}/orders?status=shipped`
        },
        {
            label: "Delivered",
            count: deliveredOrders,
            icon: PackageCheck,
            color: "green",
            href: `/${storeSlug}/orders?status=delivered`
        },
        {
            label: "Cancelled",
            count: cancelledOrders,
            icon: XCircle,
            color: "red",
            href: `/${storeSlug}/orders?status=cancelled`
        }
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-500" },
            purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-500" },
            green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-500" },
            red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-500" }
        }
        return colors[color] || colors.yellow
    }

    return (
        <Card>
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Order Overview</h3>
                    <Link href={`/${storeSlug}/orders`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            View All
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statuses.map((status) => {
                        const Icon = status.icon
                        const colorClasses = getColorClasses(status.color)

                        return (
                            <Link key={status.label} href={status.href} className="block">
                                <div className={`p-4 rounded-xl ${colorClasses.bg} border ${colorClasses.border} hover:opacity-80 transition-opacity`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                                    </div>
                                    <p className={`text-2xl font-bold ${colorClasses.text}`}>{status.count}</p>
                                    <p className="text-xs text-muted-foreground">{status.label}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
