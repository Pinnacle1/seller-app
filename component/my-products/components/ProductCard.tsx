"use client"

import { MoreVertical, Edit, Trash, Eye } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  title: string
  price: number
  stock: number
  status: "published" | "draft"
  sold: number
  image: string
}

interface ProductCardProps {
  product: Product
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="border border-border rounded-xl p-4 flex gap-4">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg shrink-0 overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{product.title}</h3>
            <p className="text-lg font-bold">₹{product.price}</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-accent rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg py-1 min-w-32 z-10">
                <button
                  onClick={() => {
                    onEdit(product.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => {
                    onDelete(product.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-destructive"
                >
                  <Trash className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>Stock: {product.stock}</span>
          <span>Sold: {product.sold}</span>
          <span
            className={`px-2 py-0.5 rounded-full ${product.status === "published" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
          >
            {product.status}
          </span>
        </div>
      </div>
    </div>
  )
}
