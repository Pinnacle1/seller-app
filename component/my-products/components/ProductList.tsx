"use client"

import { ProductCard } from "./ProductCard"

const mockProducts = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 1200,
    stock: 3,
    status: "published" as const,
    sold: 12,
    image: "/classic-denim-jacket.png",
  },
  {
    id: "2",
    title: "Retro Sneakers",
    price: 850,
    stock: 1,
    status: "published" as const,
    sold: 8,
    image: "/retro-sneakers.png",
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 1500,
    stock: 0,
    status: "draft" as const,
    sold: 5,
    image: "/brown-leather-messenger-bag.png",
  },
  {
    id: "4",
    title: "Wool Sweater",
    price: 650,
    stock: 5,
    status: "published" as const,
    sold: 20,
    image: "/cozy-wool-sweater.png",
  },
]

interface ProductListProps {
  filter: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductList({ filter, onEdit, onDelete }: ProductListProps) {
  const filtered =
    filter === "all"
      ? mockProducts
      : filter === "low-stock"
        ? mockProducts.filter((p) => p.stock <= 1)
        : mockProducts.filter((p) => p.status === filter)

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No products found</div>
      ) : (
        filtered.map((product) => (
          <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}
