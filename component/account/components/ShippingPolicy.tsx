"use client"

import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { useState } from "react"

export function ShippingPolicy() {
  const [shippingTime, setShippingTime] = useState("3-5")
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999")

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Shipping & Returns</h3>
      <Input
        label="Default Shipping Time (days)"
        value={shippingTime}
        onChange={(e) => setShippingTime(e.target.value)}
      />
      <Input
        label="Free Shipping Threshold (₹)"
        value={freeShippingThreshold}
        onChange={(e) => setFreeShippingThreshold(e.target.value)}
      />
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">Return Policy</label>
        <textarea
          className="w-full h-20 px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
          defaultValue="7-day returns accepted for unused items in original condition."
        />
      </div>
      <Button variant="outline">Save Policy</Button>
    </div>
  )
}
