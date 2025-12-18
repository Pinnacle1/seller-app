"use client"

import { MoreVertical, Edit, Trash, Eye, Package } from "lucide-react"
import { useState } from "react"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleSelect: (id: number) => void
}

export function ProductCard({
  product,
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
}: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const primaryImage = product.images?.find(img => img.position === 0)?.image_url
    || product.images?.[0]?.image_url
    || null

  const conditionLabels = {
    new: "New",
    good: "Good",
    fair: "Fair",
  }

  return (
    <div
      className={`border rounded-xl p-4 flex gap-4 transition-colors ${isSelected ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
        }`}
    >
      {/* Selection Checkbox */}
      <div className="flex items-center">
        <button
          onClick={() => onToggleSelect(product.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
              ? "bg-foreground border-foreground"
              : "border-muted-foreground hover:border-foreground"
            }`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Product Image */}
      <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{product.title}</h3>
            <p className="text-lg font-bold">₹{product.price.toLocaleString()}</p>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-accent rounded-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />

                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg py-1 min-w-36 z-20 shadow-lg">
                  <button
                    onClick={() => {
                      onEdit(String(product.id))
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      window.open(`/product/${product.id}`, "_blank")
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={() => {
                      onDelete(String(product.id))
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-destructive"
                  >
                    <Trash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Meta */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs text-muted-foreground">
          <span>Stock: {product.quantity}</span>
          {product.condition && (
            <span className="px-2 py-0.5 rounded-full bg-muted">
              {conditionLabels[product.condition]}
            </span>
          )}
          {product.category && (
            <span className="px-2 py-0.5 rounded-full bg-foreground/10">
              {product.category}
            </span>
          )}
        </div>

        {/* Low Stock Warning */}
        {product.quantity <= 5 && product.quantity > 0 && (
          <p className="text-xs text-yellow-500 mt-1">⚠️ Low stock warning</p>
        )}
        {product.quantity === 0 && (
          <p className="text-xs text-destructive mt-1">❌ Out of stock</p>
        )}
      </div>
    </div>
  )
}
