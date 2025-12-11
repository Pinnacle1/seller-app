"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { Select } from "@/component/ui/Select"
import { UploadZone } from "@/component/ui/UploadZone"

interface ProductFormProps {
  onSubmit: (data: any) => void
}

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Living" },
]

const conditions = [
  { value: "new", label: "New with tags" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
]

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("clothing")
  const [condition, setCondition] = useState("good")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [brand, setBrand] = useState("")
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, category, condition, price, quantity, brand, size, color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Product Images</h3>
        <UploadZone label="Upload Images (min 1, max 8)" multiple />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Basic Info</h3>
        <Input label="Title" placeholder="Product title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Description</label>
          <textarea
            className="w-full h-24 px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
            placeholder="Describe your product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Select
            label="Condition"
            options={conditions}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Brand" placeholder="Brand name" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <Input label="Size" placeholder="S, M, L, etc." value={size} onChange={(e) => setSize(e.target.value)} />
          <Input label="Color" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Quantity"
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="button" variant="outline" className="sm:flex-1 bg-transparent">
          Save as Draft
        </Button>
        <Button type="submit" className="sm:flex-1">
          Publish Product
        </Button>
      </div>
    </form>
  )
}
