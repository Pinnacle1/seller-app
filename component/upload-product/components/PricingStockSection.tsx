"use client"

import { DollarSign } from "lucide-react"
import { Input } from "@/component/ui/Input"
import { Select } from "@/component/ui/Select"
import { ProductCondition } from "@/types/product"

interface PricingStockSectionProps {
    price: string
    quantity: string
    condition: ProductCondition
    onPriceChange: (value: string) => void
    onQuantityChange: (value: string) => void
    onConditionChange: (value: ProductCondition) => void
    conditions: { value: ProductCondition; label: string }[]
    errors: Record<string, string>
}

export function PricingStockSection({
    price,
    quantity,
    condition,
    onPriceChange,
    onQuantityChange,
    onConditionChange,
    conditions,
    errors
}: PricingStockSectionProps) {
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
                <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Pricing & Stock</h3>
                    <p className="text-xs text-muted-foreground">Set price and availability</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price (₹)"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => onPriceChange(e.target.value)}
                        error={errors.price}
                    />
                    <Input
                        label="Quantity"
                        type="number"
                        min="0"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => onQuantityChange(e.target.value)}
                        error={errors.quantity}
                    />
                </div>

                <Select
                    label="Condition"
                    value={condition}
                    onChange={(e) => onConditionChange(e.target.value as ProductCondition)}
                    options={conditions}
                />
            </div>
        </div>
    )
}
