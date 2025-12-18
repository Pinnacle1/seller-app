"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { Select } from "@/component/ui/Select"
import { UploadZone } from "@/component/ui/UploadZone"
import { Plus, X, Loader2, Save, Send } from "lucide-react"
import { Product, CreateProductRequest, ProductCondition } from "@/types/product"
import { uploadToCloudinary } from "@/service/cloudinary.service"
import { onboardService } from "@/service/onboard.service"

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: CreateProductRequest) => Promise<void>
  isSubmitting?: boolean
}

interface DetailField {
  id: string
  name: string  // Changed from 'key' to 'name' to match backend
  value: string
}

interface ImageFile {
  id: string
  file?: File
  url: string
  isUploading?: boolean
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

export function ProductForm({ initialData, onSubmit, isSubmitting = false }: ProductFormProps) {
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("clothing")
  const [condition, setCondition] = useState<ProductCondition>("good")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [details, setDetails] = useState<DetailField[]>([{ id: "1", name: "", value: "" }])
  const [images, setImages] = useState<ImageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [storeId, setStoreId] = useState<number | null>(null)
  const [isLoadingStore, setIsLoadingStore] = useState(true)

  // Fetch seller's store on mount
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await onboardService.getStores()

        if (response.success && response.data && response.data.length > 0) {
          // Use the first store (sellers typically have one store)
          setStoreId(response.data[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch store:", error)
      } finally {
        setIsLoadingStore(false)
      }
    }

    // If editing, use the product's store_id
    if (initialData?.store_id) {
      setStoreId(initialData.store_id)
      setIsLoadingStore(false)
    } else {
      fetchStore()
    }
  }, [initialData])

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setDescription(initialData.description || "")
      setCategory(initialData.category || "clothing")
      setCondition(initialData.condition || "good")
      setPrice(String(initialData.price || ""))
      setQuantity(String(initialData.quantity || 1))
      setStoreId(initialData.store_id)

      // Set attributes/details
      if (initialData.attributes && initialData.attributes.length > 0) {
        setDetails(
          initialData.attributes.map((attr, idx) => ({
            id: String(idx),
            name: attr.name,
            value: attr.value,
          }))
        )
      }

      // Set images
      if (initialData.images && initialData.images.length > 0) {
        setImages(
          initialData.images.map((img, idx) => ({
            id: String(idx),
            url: img.image_url,
          }))
        )
      }
    }
  }, [initialData])

  // Detail field handlers
  const addDetailField = () => {
    setDetails([...details, { id: Date.now().toString(), name: "", value: "" }])
  }

  const removeDetailField = (id: string) => {
    if (details.length > 1) {
      setDetails(details.filter((detail) => detail.id !== id))
    }
  }

  const updateDetailField = (id: string, field: "name" | "value", newValue: string) => {
    setDetails(details.map((detail) => (detail.id === id ? { ...detail, [field]: newValue } : detail)))
  }

  // Image upload handler
  const handleImageUpload = async (files: File[]) => {
    if (images.length + files.length > 8) {
      setErrors({ ...errors, images: "Maximum 8 images allowed" })
      return
    }

    setIsUploading(true)

    const newImages: ImageFile[] = files.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      file,
      url: URL.createObjectURL(file),
      isUploading: true,
    }))

    setImages([...images, ...newImages])

    // Upload each file to Cloudinary
    try {
      const uploadPromises = files.map(async (file, idx) => {
        const response = await uploadToCloudinary(file)
        return {
          id: newImages[idx].id,
          url: response.secure_url,
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)

      // Update images with uploaded URLs
      setImages(prevImages =>
        prevImages.map(img => {
          const uploaded = uploadedImages.find(u => u.id === img.id)
          if (uploaded) {
            return { ...img, url: uploaded.url, isUploading: false }
          }
          return img
        })
      )
    } catch (error) {
      console.error("Image upload failed:", error)
      setErrors({ ...errors, images: "Failed to upload images" })
      // Remove failed uploads
      setImages(prevImages =>
        prevImages.filter(img => !img.isUploading)
      )
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!quantity || parseInt(quantity) < 0) {
      newErrors.quantity = "Valid quantity is required"
    }
    if (images.length === 0) {
      newErrors.images = "At least one image is required"
    }
    if (!storeId) {
      newErrors.store = "No store found. Please create a store first."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !storeId) {
      return
    }

    // Build attributes array (filter out empty ones)
    const attributes = details
      .filter((detail) => detail.name && detail.value)
      .map((detail) => ({ name: detail.name, value: detail.value }))

    // Build images array - just URLs as strings
    const imageUrls = images
      .filter((img) => !img.isUploading)
      .map((img) => img.url)

    const productData: CreateProductRequest = {
      store_id: storeId,
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      attributes: attributes.length > 0 ? attributes : undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    }

    await onSubmit(productData)
  }

  if (isLoadingStore && !initialData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Store ID Info */}
      {!storeId && !initialData && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            No store found. Please complete store setup in onboarding first.
          </p>
        </div>
      )}

      {/* Product Images */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <div className="w-1 h-5 bg-foreground rounded-full" />
          <h3 className="text-base font-semibold">Product Images</h3>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {img.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
                {!img.isUploading && (
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-foreground text-background text-[10px] rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length < 8 && (
          <UploadZone
            label="Upload Images (min 1, max 8)"
            multiple
            onFilesSelected={handleImageUpload}
            disabled={isUploading}
          />
        )}
        {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
        <p className="text-xs text-muted-foreground">First image will be used as cover photo</p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <div className="w-1 h-5 bg-foreground rounded-full" />
          <h3 className="text-base font-semibold">Basic Information</h3>
        </div>
        <Input
          label="Product Title *"
          placeholder="Enter product name (min 3 characters)"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) setErrors({ ...errors, title: "" })
          }}
          error={errors.title}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description *</label>
          <textarea
            className={`w-full h-28 px-4 py-3 bg-input text-foreground border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10 resize-none transition-all ${errors.description ? "border-destructive" : "border-border"
              }`}
            placeholder="Describe your product in detail (min 10 characters)..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors({ ...errors, description: "" })
            }}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
            onChange={(e) => setCondition(e.target.value as ProductCondition)}
          />
        </div>
      </div>

      {/* Details/Attributes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-foreground rounded-full" />
            <h3 className="text-base font-semibold">Details (Optional)</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDetailField}
            className="gap-2 text-xs bg-transparent"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Details
          </Button>
        </div>

        <div className="space-y-3">
          {details.map((detail) => (
            <div key={detail.id} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Name (e.g., Brand)"
                  value={detail.name}
                  onChange={(e) => updateDetailField(detail.id, "name", e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Value (e.g., Nike)"
                  value={detail.value}
                  onChange={(e) => updateDetailField(detail.id, "value", e.target.value)}
                  className="text-sm"
                />
              </div>
              {details.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDetailField(detail.id)}
                  className="mt-2.5 p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Remove detail"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>

        {details.some((d) => d.name && d.value) && (
          <div className="pt-2 flex flex-wrap gap-2">
            {details
              .filter((d) => d.name && d.value)
              .map((detail) => (
                <div
                  key={detail.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-xs"
                >
                  <span className="font-medium text-foreground">{detail.name}:</span>
                  <span className="text-muted-foreground">{detail.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <div className="w-1 h-5 bg-foreground rounded-full" />
          <h3 className="text-base font-semibold">Pricing & Stock</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (₹) *"
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value)
              if (errors.price) setErrors({ ...errors, price: "" })
            }}
            error={errors.price}
          />
          <Input
            label="Quantity in Stock *"
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
              if (errors.quantity) setErrors({ ...errors, quantity: "" })
            }}
            error={errors.quantity}
          />
        </div>
      </div>

      {/* Error Display */}
      {errors.store && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errors.store}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
        <Button
          type="submit"
          className="sm:flex-1 gap-2"
          disabled={isSubmitting || isUploading || !storeId}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {initialData ? "Update Product" : "Publish Product"}
        </Button>
      </div>
    </form>
  )
}
