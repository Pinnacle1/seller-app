"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { ProductList } from "./components/ProductList"
import { Button } from "@/component/ui/Button"
import { Plus } from "lucide-react"

const filters = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "low-stock", label: "Low Stock" },
]

export function MyProductsClient() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product listings</p>
          </div>
          <Button onClick={() => router.push("/upload-product")}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors whitespace-nowrap ${activeFilter === f.value ? "bg-foreground text-background border-foreground" : "border-border hover:bg-accent"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ProductList
          filter={activeFilter}
          onEdit={(id) => router.push(`/upload-product?edit=${id}`)}
          onDelete={(id) => console.log("Delete", id)}
        />
      </div>
    </DashboardLayout>
  )
}
