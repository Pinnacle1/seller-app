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
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
          <p>{order.buyer}</p>
          <p className="text-sm text-muted-foreground">123 Main Street, Mumbai 400001</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">Vintage Denim Jacket × 1</p>
            <p className="text-sm text-muted-foreground">SKU: VDJ-001</p>
          </div>
        </div>

        <div className="flex justify-between py-2 border-t border-border">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold">{order.total}</span>
        </div>

        {order.fulfillment === "pending" && (
          <div className="space-y-3">
            <Input label="Tracking Number" placeholder="Enter tracking ID" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                Print Slip
              </Button>
              <Button className="flex-1">Mark Shipped</Button>
            </div>
          </div>
        )}

        {order.fulfillment === "shipped" && <Button className="w-full">Mark Delivered</Button>}
      </div>
    </Modal>
  )
}
