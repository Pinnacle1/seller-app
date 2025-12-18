"use client"

import { useState } from "react"
import { Modal } from "@/component/ui/Modal"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { Order } from "@/types/order"
import { Package, MapPin, User, Phone, Mail, Truck, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (status: "shipped" | "delivered" | "cancelled", trackingNumber?: string) => Promise<void>
  isUpdating?: boolean
}

export function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus, isUpdating }: OrderDetailModalProps) {
  const [trackingNumber, setTrackingNumber] = useState("")

  if (!order) return null

  const handleMarkShipped = async () => {
    await onUpdateStatus("shipped", trackingNumber || undefined)
    setTrackingNumber("")
  }

  const handleMarkDelivered = async () => {
    await onUpdateStatus("delivered")
  }

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      await onUpdateStatus("cancelled")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.id}`}>
      <div className="space-y-5">
        {/* Order Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${order.status === "delivered" ? "bg-green-500/10 text-green-500" :
              order.status === "shipped" ? "bg-purple-500/10 text-purple-500" :
                order.status === "paid" ? "bg-blue-500/10 text-blue-500" :
                  order.status === "cancelled" ? "bg-red-500/10 text-red-500" :
                    "bg-yellow-500/10 text-yellow-500"
            }`}>
            {order.status}
          </span>
        </div>

        {/* Customer Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" /> Customer Details
          </h4>
          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <p className="font-medium">{order.user_name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-3 h-3" /> {order.user_email}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Shipping Address
            </h4>
            <div className="p-3 bg-muted/50 rounded-lg space-y-1">
              <p className="font-medium flex items-center gap-2">
                {order.shipping_address.name}
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.shipping_address.phone}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address.line1}
                {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              </p>
              <p className="text-sm text-muted-foreground">{order.shipping_address.country}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Package className="w-4 h-4" /> Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="p-3 bg-muted/50 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.product_title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-sm">₹{item.price_at_purchase.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between py-3 border-t border-border">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="font-bold text-lg">₹{order.total_amount.toLocaleString()}</span>
        </div>

        {/* Order Date */}
        <p className="text-xs text-muted-foreground text-center">
          Ordered on {new Date(order.created_at).toLocaleString()}
        </p>

        {/* Action Buttons */}
        {(order.status === "paid" || order.status === "pending") && (
          <div className="space-y-3 pt-2">
            <Input
              label="Tracking Number"
              placeholder="Enter tracking ID (optional)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleMarkShipped}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Truck className="w-4 h-4 mr-2" />
                )}
                Mark Shipped
              </Button>
            </div>
          </div>
        )}

        {order.status === "shipped" && (
          <Button
            className="w-full"
            onClick={handleMarkDelivered}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Mark Delivered
          </Button>
        )}

        {(order.status === "delivered" || order.status === "cancelled") && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              This order has been {order.status}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
