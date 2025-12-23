"use client"

import { useState } from "react"
import { ProductCondition } from "@/types/product"
import { FileText, Pencil } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { Select } from "@/component/ui/Select"

interface BasicInfoSectionProps {
    title: string
    description: string
    category: string
    condition: ProductCondition
    onUpdate: (updates: { title?: string; description?: string; category?: string; condition?: ProductCondition }) => void
}

const categories = [
    { value: "clothing", label: "Clothing" },
    { value: "shoes", label: "Shoes" },
    { value: "accessories", label: "Accessories" },
    { value: "electronics", label: "Electronics" },
    { value: "home", label: "Home & Living" },
    { value: "books", label: "Books" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "toys", label: "Toys & Games" },
    { value: "other", label: "Other" },
]

const conditions: { value: ProductCondition; label: string }[] = [
    { value: "new", label: "New with tags" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
]

export function BasicInfoSection({ title, description, category, condition, onUpdate }: BasicInfoSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [localTitle, setLocalTitle] = useState(title)
    const [localDescription, setLocalDescription] = useState(description)
    const [localCategory, setLocalCategory] = useState(category)
    const [localCondition, setLocalCondition] = useState(condition)

    const handleStartEdit = () => {
        setLocalTitle(title)
        setLocalDescription(description)
        setLocalCategory(category)
        setLocalCondition(condition)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setLocalTitle(title)
        setLocalDescription(description)
        setLocalCategory(category)
        setLocalCondition(condition)
        setIsEditing(false)
    }

    const handleSave = () => {
        onUpdate({
            title: localTitle,
            description: localDescription,
            category: localCategory,
            condition: localCondition,
        })
        setIsEditing(false)
    }

    const getCategoryLabel = (value: string) => {
        return categories.find(c => c.value === value)?.label || value
    }

    const getConditionLabel = (value: ProductCondition) => {
        return conditions.find(c => c.value === value)?.label || value
    }

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Basic Information</h3>
                        <p className="text-xs text-muted-foreground">Title, description & category</p>
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
                        <Input
                            label="Product Title *"
                            placeholder="Enter product name"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Description *</label>
                            <textarea
                                className="w-full h-32 px-4 py-3 bg-input text-foreground border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10 resize-none transition-all"
                                placeholder="Describe your product in detail..."
                                value={localDescription}
                                onChange={(e) => setLocalDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                                label="Category"
                                options={categories}
                                value={localCategory}
                                onChange={(e) => setLocalCategory(e.target.value)}
                            />
                            <Select
                                label="Condition"
                                options={conditions}
                                value={localCondition}
                                onChange={(e) => setLocalCondition(e.target.value as ProductCondition)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Title</p>
                            <p className="text-sm font-medium">{title}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </div>

                        {/* Category & Condition */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                                <span className="inline-flex px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">
                                    {getCategoryLabel(category)}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Condition</p>
                                <span className="inline-flex px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">
                                    {getConditionLabel(condition)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
