"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { ProductForm } from "./components/ProductForm"
import { Loader2, ArrowLeft } from "lucide-react"
import useProductStore from "@/store/product-store"
import { CreateProductRequest } from "@/types/product"

export function UploadProductClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [isLoading, setIsLoading] = useState(!!editId)

  const {
    selectedProduct,
    isCreating,
    isUpdating,
    error,
    fetchProductById,
    createProduct,
    updateProduct,
    setSelectedProduct,
    clearError,
  } = useProductStore()

  // Fetch product for editing
  useEffect(() => {
    if (editId) {
      setIsLoading(true)
      fetchProductById(editId).finally(() => setIsLoading(false))
    } else {
      // Clear selected product when creating new
      setSelectedProduct(null)
    }

    // Cleanup on unmount
    return () => {
      setSelectedProduct(null)
    }
  }, [editId])

  const handleSubmit = async (data: CreateProductRequest) => {
    if (editId) {
      // Update existing product
      // If selectedProduct is null here, the fetch failed - but we still try to update
      const result = await updateProduct(editId, {
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        price: data.price,
        quantity: data.quantity,
      })
      if (result) {
        router.push("/my-products")
      }
    } else {
      // Create new product
      const result = await createProduct(data)
      if (result) {
        router.push("/my-products")
      }
    }
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold">
            {editId ? "Edit Product" : "Upload Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {editId
              ? "Update your product details"
              : "Add a new product to your store"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={clearError}
              className="text-xs text-destructive hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State for Edit */}
        {isLoading ? (
          <div className="border border-border rounded-xl p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-xl p-4 md:p-6">
            <ProductForm
              initialData={editId ? selectedProduct : null}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
