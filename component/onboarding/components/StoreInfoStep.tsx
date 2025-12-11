"use client"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Store } from "lucide-react"

interface StoreInfoStepProps {
  onComplete: () => void
}

export function StoreInfoStep({ onComplete }: StoreInfoStepProps) {
  const [storeName, setStoreName] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
          <Store className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Name Your Store</h2>
        <p className="text-sm text-muted-foreground">Choose a memorable name and describe what you sell</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
        <Input
          label="Store Name"
          placeholder="Enter your store name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Store Description</label>
          <textarea
            placeholder="Describe your store and what you sell..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  )
}
