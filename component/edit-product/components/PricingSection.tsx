"use client"

import { useState } from "react"
import { DollarSign, Package } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"

interface PricingSectionProps {
    price: number
    quantity: number
    onUpdate: (updates: { price?: number; quantity?: number }) => void
}

export function PricingSection({ price, quantity, onUpdate }: PricingSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [localPrice, setLocalPrice] = useState(String(price))
    const [localQuantity, setLocalQuantity] = useState(String(quantity))

    const handleStartEdit = () => {
        setLocalPrice(String(price))
        setLocalQuantity(String(quantity))
        setIsEditing(true)
    }

    const handleCancel = () => {
        setLocalPrice(String(price))
        setLocalQuantity(String(quantity))
        setIsEditing(false)
    }

    const handleSave = () => {
        onUpdate({
            price: parseFloat(localPrice) || 0,
            quantity: parseInt(localQuantity) || 0,
        })
        setIsEditing(false)
    }

    const getStockStatus = (qty: number) => {
        if (qty === 0) return { label: "Out of Stock", color: "bg-destructive/20 text-destructive" }
        if (qty <= 5) return { label: "Low Stock", color: "bg-amber-500/20 text-amber-500" }
        return { label: "In Stock", color: "bg-emerald-500/20 text-emerald-500" }
    }

    const stockStatus = getStockStatus(quantity)

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Pricing & Stock</h3>
                        <p className="text-xs text-muted-foreground">Manage price and inventory</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" onClick={handleStartEdit}>
                        Edit
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Price (₹) *"
                            type="number"
                            placeholder="0"
                            value={localPrice}
                            onChange={(e) => setLocalPrice(e.target.value)}
                        />
                        <Input
                            label="Quantity in Stock *"
                            type="number"
                            placeholder="0"
                            value={localQuantity}
                            onChange={(e) => setLocalQuantity(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {/* Price Display */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Stock Display */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-2xl font-bold">{quantity}</span>
                                    <span className="text-sm text-muted-foreground">units</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                    {stockStatus.label}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
