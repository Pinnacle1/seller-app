"use client"

import { Tag, Plus, X } from "lucide-react"
import { Input } from "@/component/ui/Input"

interface DetailField {
    id: string
    name: string
    value: string
}

interface DetailFieldsSectionProps {
    details: DetailField[]
    onAddField: () => void
    onRemoveField: (id: string) => void
    onUpdateField: (id: string, field: "name" | "value", value: string) => void
}

export function DetailFieldsSection({
    details,
    onAddField,
    onRemoveField,
    onUpdateField
}: DetailFieldsSectionProps) {
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Product Details</h3>
                        <p className="text-xs text-muted-foreground">Additional specifications</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onAddField}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Field
                </button>
            </div>

            <div className="p-5 space-y-4">
                {details.map((detail, idx) => (
                    <div key={detail.id} className="flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            <Input
                                placeholder="e.g. Size, Color, Material"
                                value={detail.name}
                                onChange={(e) => onUpdateField(detail.id, "name", e.target.value)}
                            />
                            <Input
                                placeholder="e.g. Large, Blue, Cotton"
                                value={detail.value}
                                onChange={(e) => onUpdateField(detail.id, "value", e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemoveField(detail.id)}
                            disabled={details.length === 1}
                            className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <p className="text-xs text-muted-foreground">
                    Add custom fields like Size, Color, Material, Brand, etc.
                </p>
            </div>
        </div>
    )
}

export type { DetailField }
