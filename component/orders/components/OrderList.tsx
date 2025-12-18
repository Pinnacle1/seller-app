"use client"

import Image from "next/image"
import { Order, OrderStatus } from "@/types/order"
import {
  Package,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  Loader2,
  Wallet
} from "lucide-react"

interface OrderListProps {
  orders: Order[]
  filter: string
  onUpdateStatus: (orderId: number, status: "shipped" | "delivered" | "cancelled") => Promise<void>
  isUpdating?: boolean
  updatingOrderId?: number | null
  isLoading?: boolean
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/50" },
  paid: { label: "Processing", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/50" },
  shipped: { label: "Shipped", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/50" },
  delivered: { label: "Delivered", color: "text-green-500", bg: "bg-green-500/10 border-green-500/50" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10 border-red-500/50" },
}

const paymentLabels: Record<string, string> = {
  stripe: "Credit card",
  razorpay: "Razorpay",
  paypal: "PayPal",
  cod: "Cash on Delivery",
}

function MobileOrderCard({
  order,
  onUpdateStatus,
  isCurrentlyUpdating
}: {
  order: Order
  onUpdateStatus: (orderId: number, status: "shipped" | "delivered" | "cancelled") => Promise<void>
  isCurrentlyUpdating?: boolean
}) {
  const status = statusConfig[order.status]
  const firstItem = order.items[0]

  const actions = order.status === "pending" || order.status === "paid"
    ? [{ status: "shipped" as const, label: "Ship", icon: Truck }]
    : order.status === "shipped"
      ? [{ status: "delivered" as const, label: "Delivered", icon: CheckCircle }]
      : []

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card mb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border text-xs">
        <span><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{order.user_name}</span></span>
        <span className="text-muted-foreground">#{order.id}</span>
      </div>

      {/* Product */}
      <div className="p-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
            {firstItem?.product_image ? (
              <Image
                src={firstItem.product_image}
                alt={firstItem.product_title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{firstItem?.product_title}</p>
            <p className="text-xs text-muted-foreground">Qty: {firstItem?.quantity}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${status.bg} ${status.color}`}>
                {status.label}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {paymentLabels[order.payment_method] || "COD"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {actions.map((action) => (
              <button
                key={action.status}
                onClick={() => onUpdateStatus(order.id, action.status)}
                disabled={isCurrentlyUpdating}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-border rounded text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isCurrentlyUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <action.icon className="w-3 h-3" />}
                {action.label}
              </button>
            ))}
            <button
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              disabled={isCurrentlyUpdating}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-red-500/50 text-red-500 rounded text-xs font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
        {order.shipping_address ? (
          <div className="flex items-center gap-1 text-muted-foreground truncate mr-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{order.shipping_address.city}, {order.shipping_address.state}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">No address</span>
        )}
        <span className="font-semibold whitespace-nowrap">₹{order.total_amount.toLocaleString()}</span>
      </div>
    </div>
  )
}

function DesktopOrderRow({
  order,
  onUpdateStatus,
  isCurrentlyUpdating
}: {
  order: Order
  onUpdateStatus: (orderId: number, status: "shipped" | "delivered" | "cancelled") => Promise<void>
  isCurrentlyUpdating?: boolean
}) {
  const status = statusConfig[order.status]
  const firstItem = order.items[0]

  const actions = order.status === "pending" || order.status === "paid"
    ? [{ status: "shipped" as const, label: "Mark Shipped", icon: Truck, variant: "default" }]
    : order.status === "shipped"
      ? [{ status: "delivered" as const, label: "Mark Delivered", icon: CheckCircle, variant: "default" }]
      : []

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card mb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border text-sm">
        <div className="flex items-center gap-4">
          <span><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{order.user_name}</span></span>
          <span className="text-muted-foreground">
            Date: {new Date(order.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <span className="text-muted-foreground">Order ID: <span className="font-semibold text-foreground">{order.id}</span></span>
      </div>

      {/* Product Row */}
      <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
        {/* Product - 5 cols */}
        <div className="col-span-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
              {firstItem?.product_image ? (
                <Image
                  src={firstItem.product_image}
                  alt={firstItem.product_title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{firstItem?.product_title}</p>
              <p className="text-xs text-muted-foreground">Color: <span className="text-orange-500">Black</span> · Size: 23</p>
              <p className="text-xs text-muted-foreground">Quantity: {firstItem?.quantity}</p>
            </div>
          </div>
        </div>

        {/* Payment - 2 cols */}
        <div className="col-span-2">
          <div className="flex items-center gap-1.5 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            {paymentLabels[order.payment_method] || "COD"}
          </div>
        </div>

        {/* Status - 2 cols */}
        <div className="col-span-2">
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Actions - 3 cols */}
        <div className="col-span-3 flex flex-col gap-2 items-end">
          {actions.map((action) => (
            <button
              key={action.status}
              onClick={() => onUpdateStatus(order.id, action.status)}
              disabled={isCurrentlyUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50 min-w-[120px] justify-center"
            >
              {isCurrentlyUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <action.icon className="w-3.5 h-3.5" />}
              {action.label}
            </button>
          ))}
          {(order.status === "pending" || order.status === "paid" || order.status === "shipped") && (
            <button
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              disabled={isCurrentlyUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500/50 text-red-500 rounded text-xs font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50 min-w-[120px] justify-center"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Order
            </button>
          )}
          {(order.status === "delivered" || order.status === "cancelled") && (
            <span className="text-xs text-muted-foreground">{order.status === "delivered" ? "✓ Completed" : "✗ Cancelled"}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
        {order.shipping_address ? (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" />
            <span>
              <span className="font-medium text-foreground">Deliver to: </span>
              {order.shipping_address.name}, {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No delivery address</span>
        )}
        <span className="text-sm font-semibold whitespace-nowrap">Total: ₹{order.total_amount.toLocaleString()}</span>
      </div>
    </div>
  )
}

export function OrderList({ orders, filter, onUpdateStatus, isUpdating, updatingOrderId, isLoading }: OrderListProps) {
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="h-10 bg-muted/30" />
            <div className="p-3 sm:p-4 flex gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
            <div className="h-10 bg-muted/20 border-t border-border" />
          </div>
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-10 sm:py-16 border border-dashed border-border rounded-xl bg-card">
        <Package className="w-10 h-10 sm:w-14 sm:h-14 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm sm:text-base font-medium">No orders found</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {filter === "all" ? "Orders will appear here" : `No ${filter} orders`}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Desktop Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-3">
        <div className="col-span-5">Product</div>
        <div className="col-span-2">Payment</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Action</div>
      </div>

      {/* Mobile Cards (sm and below) */}
      <div className="lg:hidden">
        {filtered.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            onUpdateStatus={onUpdateStatus}
            isCurrentlyUpdating={updatingOrderId === order.id}
          />
        ))}
      </div>

      {/* Desktop Rows (lg and above) */}
      <div className="hidden lg:block">
        {filtered.map((order) => (
          <DesktopOrderRow
            key={order.id}
            order={order}
            onUpdateStatus={onUpdateStatus}
            isCurrentlyUpdating={updatingOrderId === order.id}
          />
        ))}
      </div>
    </div>
  )
}
