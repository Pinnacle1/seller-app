"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Loader2, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { ProductCondition } from "@/types/product"

// Components
import { ImageUploadSection } from "./components/ImageUploadSection"
import { PricingStockSection } from "./components/PricingStockSection"
import { BasicInfoSection } from "./components/BasicInfoSection"
import { DetailFieldsSection } from "./components/DetailFieldsSection"

// Hook & Types
import { useUploadProduct } from "./hooks/useUploadProduct"
import { categories, conditions } from "./hooks/types"

interface UploadProductClientProps {
  storeSlug: string
}

export function UploadProductClient({ storeSlug }: UploadProductClientProps) {
  const router = useRouter()
  const {
    currentStoreId, isLoadingStore, title, description, category, subcategory, condition, price, quantity,
    details, images, isUploading, errors, isCreating, error,
    setTitle, setDescription, setCategory, setSubcategory, setCondition, setPrice, setQuantity,
    addDetailField, removeDetailField, updateDetailField,
    handleImageUpload, removeImage, handleSubmit, clearError
  } = useUploadProduct(storeSlug)

  // Show loading while store is being loaded
  if (isLoadingStore) {
    return (
      <DashboardLayout storeSlug={storeSlug}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout >
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Upload New Product</h1>
              <p className="text-sm text-muted-foreground mt-1">Add a new product to your store</p>
            </div>
            <Button type="submit" disabled={isCreating || isUploading || !currentStoreId} className="hidden sm:flex gap-2">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Product
            </Button>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <button type="button" onClick={clearError} className="text-xs text-destructive hover:underline">Dismiss</button>
          </div>
        )}

        {!currentStoreId && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive">No store found. Please complete store setup first.</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ImageUploadSection images={images} isUploading={isUploading} onFilesSelected={handleImageUpload} onRemoveImage={removeImage} error={errors.images} />
            <PricingStockSection price={price} quantity={quantity} condition={condition} onPriceChange={setPrice} onQuantityChange={setQuantity} onConditionChange={(v) => setCondition(v as ProductCondition)} conditions={conditions} errors={errors} />
          </div>
          <div className="space-y-6">
            <BasicInfoSection
              title={title}
              description={description}
              category={category}
              subcategory={subcategory}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onSubcategoryChange={setSubcategory}
              categories={categories}
              errors={errors}
            />
            <DetailFieldsSection details={details} onAddField={addDetailField} onRemoveField={removeDetailField} onUpdateField={updateDetailField} />
          </div>
        </div>

        {/* Mobile Submit Button */}
        <div className="mt-6 sm:hidden">
          <Button type="submit" disabled={isCreating || isUploading || !currentStoreId} className="w-full gap-2">
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish Product
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
