"use client"

import { Modal } from "@/component/ui/Modal"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"

interface Order {
  id: string
  date: string
  buyer: string
  items: string
  total: string
  payment: "paid" | "pending"
  fulfillment: "pending" | "shipped" | "delivered"
}

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  if (!order) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.id}`}>
      <div className="space-y-5">
        <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</h4>
          <p className="font-medium">{order.buyer}</p>
          <p className="text-sm text-muted-foreground">123 Main Street, Mumbai 400001</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Items</h4>
          <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-1">
            <p className="text-sm font-medium">Vintage Denim Jacket × 1</p>
            <p className="text-xs text-muted-foreground">SKU: VDJ-001</p>
            <p className="text-sm font-semibold mt-2">₹1,250</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground">Order Total</span>
          <span className="text-xl font-bold">{order.total}</span>
        </div>

        {order.fulfillment === "pending" && (
          <div className="space-y-3 pt-2">
            <Input label="Tracking Number" placeholder="Enter tracking ID" />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                Print Slip
              </Button>
              <Button className="flex-1">Mark Shipped</Button>
            </div>
          </div>
        )}

        {order.fulfillment === "shipped" && (
          <div className="pt-2">
            <Button className="w-full">Mark Delivered</Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
