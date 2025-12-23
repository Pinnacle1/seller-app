"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Loader2, ArrowLeft, Package, Save } from "lucide-react"
import { useProductDetailQuery, useUpdateProduct } from "@/queries/use-products-query"
import { Product, ProductCondition, UpdateProductRequest, ProductAttribute } from "@/types/product"
import { Button } from "@/component/ui/Button"

// Section Components
import { ProductImagesSection } from "./components/ProductImagesSection"
import { BasicInfoSection } from "./components/BasicInfoSection"
import { DetailsSection } from "./components/DetailsSection"
import { PricingSection } from "./components/PricingSection"

interface EditProductClientProps {
    id: string
    storeSlug: string
}

export function EditProductClient({ id, storeSlug }: EditProductClientProps) {
    const router = useRouter()
    const productId = parseInt(id, 10)

    const [hasChanges, setHasChanges] = useState(false)
    const [localProduct, setLocalProduct] = useState<Product | null>(null)

    // Fetch product (React Query)
    const {
        data: fetchedProduct,
        isPending: isLoading,
        error: fetchError
    } = useProductDetailQuery(productId)

    // Update mutation
    const updateMutation = useUpdateProduct()

    // Use local state for edits, fall back to fetched data
    const selectedProduct = localProduct ?? fetchedProduct ?? null

    // Sync local state when fetched data changes (initial load only)
    if (fetchedProduct && !localProduct && !hasChanges) {
        setLocalProduct(fetchedProduct)
    }

    const handleSaveAll = async () => {
        if (!selectedProduct || !productId) return

        const updateData: UpdateProductRequest = {
            title: selectedProduct.title,
            description: selectedProduct.description,
            category: selectedProduct.category,
            condition: selectedProduct.condition,
            price: selectedProduct.price,
            quantity: selectedProduct.quantity,
        }

        try {
            await updateMutation.mutateAsync({ productId, data: updateData })
            setHasChanges(false)
        } catch (err) {
            // Error handled by mutation
        }
    }

    const handleProductUpdate = (updates: Partial<Product>) => {
        if (selectedProduct) {
            setLocalProduct({ ...selectedProduct, ...updates })
            setHasChanges(true)
        }
    }

    const isSaving = updateMutation.isPending
    const error = fetchError?.message || (updateMutation.error?.message ?? null)

    if (isLoading) {
        return (
            <DashboardLayout storeSlug={storeSlug}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading product...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!selectedProduct) {
        return (
            <DashboardLayout storeSlug={storeSlug}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Package className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold">Product Not Found</h2>
                    <p className="text-sm text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push(`/${storeSlug}/my-products`)}>
                        Back to Products
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout storeSlug={storeSlug}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Products
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Edit Product</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Update your product details across different sections
                            </p>
                        </div>

                        {/* Save Button */}
                        {hasChanges && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-amber-500">Unsaved changes</span>
                                <Button
                                    onClick={handleSaveAll}
                                    disabled={isSaving}
                                    className="gap-2"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save All Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Product Images Section */}
                        <ProductImagesSection
                            images={selectedProduct.images}
                            onUpdate={(images) => handleProductUpdate({ images })}
                        />

                        {/* Pricing & Stock Section */}
                        <PricingSection
                            price={selectedProduct.price}
                            quantity={selectedProduct.quantity}
                            onUpdate={(updates: { price?: number; quantity?: number }) => handleProductUpdate(updates)}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <BasicInfoSection
                            title={selectedProduct.title}
                            description={selectedProduct.description}
                            category={selectedProduct.category}
                            condition={selectedProduct.condition}
                            onUpdate={(updates: { title?: string; description?: string; category?: string; condition?: ProductCondition }) => handleProductUpdate(updates)}
                        />

                        {/* Details/Attributes Section */}
                        <DetailsSection
                            attributes={selectedProduct.attributes}
                            onUpdate={(attributes: ProductAttribute[]) => handleProductUpdate({ attributes })}
                        />
                    </div>
                </div>

                {/* Mobile Save Button */}
                {hasChanges && (
                    <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden">
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="w-full gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save All Changes
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
