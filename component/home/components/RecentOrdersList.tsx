"use client"

import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { RecentOrder } from "@/service/dashboard.service"
import { ArrowRight, ShoppingBag, Clock, CheckCircle, Truck, XCircle, ChevronRight, PackageCheck } from "lucide-react"
import Link from "next/link"

interface RecentOrdersListProps {
    orders: RecentOrder[]
    storeSlug: string
}

export function RecentOrdersList({ orders, storeSlug }: RecentOrdersListProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
            case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />
            case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />
            case 'delivered': return <PackageCheck className="w-4 h-4 text-green-500" />
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    return (
        <Card>
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Recent Orders</h3>
                    <Link href={`/${storeSlug}/orders`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            View All
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="divide-y divide-border">
                {orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No orders yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Orders will appear here once customers start buying</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/${storeSlug}/orders/${order.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{order.order_number}</p>
                                    {getStatusIcon(order.status)}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {order.customer_name} • {order.items_count} item{order.items_count > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold">₹{order.total.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                    ))
                )}
            </div>
        </Card>
    )
}
