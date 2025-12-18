"use client"

import { ProductCard } from "./ProductCard"
import { Product } from "@/types/product"
import { Package } from "lucide-react"

interface ProductListProps {
  products: Product[]
  filter: string
  selectedIds: number[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleSelect: (id: number) => void
  isLoading?: boolean
}

export function ProductList({
  products,
  filter,
  selectedIds,
  onEdit,
  onDelete,
  onToggleSelect,
  isLoading,
}: ProductListProps) {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-1">No products found</h3>
        <p className="text-sm">
          {filter === "all"
            ? "Start by adding your first product."
            : `No ${filter} products at the moment.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedIds.includes(product.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  )
}
