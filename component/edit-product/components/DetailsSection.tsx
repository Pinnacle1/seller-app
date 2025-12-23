"use client"

import { useState } from "react"
import { ProductAttribute } from "@/types/product"
import { Tag, Plus, X } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"

interface DetailsSectionProps {
    attributes: ProductAttribute[]
    onUpdate: (attributes: ProductAttribute[]) => void
}

interface LocalAttribute {
    id: string
    name: string
    value: string
}

export function DetailsSection({ attributes, onUpdate }: DetailsSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [localAttributes, setLocalAttributes] = useState<LocalAttribute[]>(
        attributes.map((attr, idx) => ({ id: String(idx), name: attr.name, value: attr.value }))
    )

    const handleStartEdit = () => {
        setLocalAttributes(
            attributes.length > 0
                ? attributes.map((attr, idx) => ({ id: String(idx), name: attr.name, value: attr.value }))
                : [{ id: "1", name: "", value: "" }]
        )
        setIsEditing(true)
    }

    const handleCancel = () => {
        setLocalAttributes(
            attributes.map((attr, idx) => ({ id: String(idx), name: attr.name, value: attr.value }))
        )
        setIsEditing(false)
    }

    const handleSave = () => {
        const validAttributes = localAttributes
            .filter((attr) => attr.name.trim() && attr.value.trim())
            .map((attr) => ({ name: attr.name.trim(), value: attr.value.trim() }))
        onUpdate(validAttributes)
        setIsEditing(false)
    }

    const addAttribute = () => {
        setLocalAttributes([...localAttributes, { id: Date.now().toString(), name: "", value: "" }])
    }

    const removeAttribute = (id: string) => {
        if (localAttributes.length > 1) {
            setLocalAttributes(localAttributes.filter((attr) => attr.id !== id))
        }
    }

    const updateAttribute = (id: string, field: "name" | "value", value: string) => {
        setLocalAttributes(
            localAttributes.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr))
        )
    }

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Product Details</h3>
                        <p className="text-xs text-muted-foreground">{attributes.length} attributes</p>
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
                    <div className="space-y-4">
                        {localAttributes.map((attr) => (
                            <div key={attr.id} className="flex items-start gap-3">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Attribute name (e.g., Brand)"
                                        value={attr.name}
                                        onChange={(e) => updateAttribute(attr.id, "name", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Value (e.g., Nike)"
                                        value={attr.value}
                                        onChange={(e) => updateAttribute(attr.id, "value", e.target.value)}
                                    />
                                </div>
                                {localAttributes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAttribute(attr.id)}
                                        className="mt-2.5 p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addAttribute}
                            className="gap-2"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Attribute
                        </Button>
                    </div>
                ) : (
                    <div>
                        {attributes.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-muted-foreground">No product details added</p>
                                <p className="text-xs text-muted-foreground mt-1">Click Edit to add details like brand, size, color, etc.</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {attributes.map((attr, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg"
                                    >
                                        <span className="text-xs font-medium text-foreground">{attr.name}:</span>
                                        <span className="text-xs text-muted-foreground">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
