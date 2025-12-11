"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/component/ui/Modal"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { Select } from "@/component/ui/Select"

interface CreateStoreModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const categories = [
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Living" },
  { value: "vintage", label: "Vintage" },
  { value: "other", label: "Other" },
]

export function CreateStoreModal({ isOpen, onClose, onComplete }: CreateStoreModalProps) {
  const [storeName, setStoreName] = useState("")
  const [storeSlug, setStoreSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("fashion")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Store">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Store Name"
          placeholder="My Thrift Store"
          value={storeName}
          onChange={(e) => {
            setStoreName(e.target.value)
            setStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
          }}
        />
        <Input
          label="Store URL"
          placeholder="my-thrift-store"
          value={storeSlug}
          onChange={(e) => setStoreSlug(e.target.value)}
        />
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Description</label>
          <textarea
            className="w-full h-20 px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
            placeholder="Tell buyers about your store..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Select
          label="Primary Category"
          options={categories}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Create Store
          </Button>
        </div>
      </form>
    </Modal>
  )
}
