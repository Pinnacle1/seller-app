"use client"

import { FileText } from "lucide-react"
import { Input } from "@/component/ui/Input"
import { Category, getSubcategories, hasSubcategories } from "../hooks/types"

interface BasicInfoSectionProps {
    title: string
    description: string
    category: string
    subcategory: string
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onCategoryChange: (value: string) => void
    onSubcategoryChange: (value: string) => void
    categories: Category[]
    errors: Record<string, string>
}

export function BasicInfoSection({
    title,
    description,
    category,
    subcategory,
    onTitleChange,
    onDescriptionChange,
    onCategoryChange,
    onSubcategoryChange,
    categories,
    errors
}: BasicInfoSectionProps) {
    const subcategories = getSubcategories(category)
    const showSubcategory = hasSubcategories(category)

    const handleCategoryChange = (value: string) => {
        onCategoryChange(value)
        // Reset subcategory when category changes
        onSubcategoryChange("")
    }

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
                <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Basic Information</h3>
                    <p className="text-xs text-muted-foreground">Name and description</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <Input
                    label="Product Title"
                    placeholder="Enter product title..."
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    error={errors.title}
                />

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Describe your product..."
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive mt-1">{errors.description}</p>
                    )}
                </div>

                {/* Category Select */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="text-sm text-destructive mt-1">{errors.category}</p>
                    )}
                </div>

                {/* Subcategory Select - Only show if category has subcategories */}
                {showSubcategory && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                        <select
                            value={subcategory}
                            onChange={(e) => onSubcategoryChange(e.target.value)}
                            className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="">Select a type</option>
                            {subcategories.map((sub) => (
                                <option key={sub.value} value={sub.value}>
                                    {sub.label}
                                </option>
                            ))}
                        </select>
                        {errors.subcategory && (
                            <p className="text-sm text-destructive mt-1">{errors.subcategory}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
