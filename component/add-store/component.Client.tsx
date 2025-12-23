"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { ArrowLeft, Store, Loader2, ImagePlus, X, CheckCircle } from "lucide-react"
import { onboardService } from "@/service/onboard.service"
import { uploadToCloudinary } from "@/service/cloudinary.service"
import useActiveStoreStore from "@/store/active-store"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"

export function AddStoreClient() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { setActiveStore } = useActiveStoreStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const removeLogo = () => {
        setLogoFile(null)
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview)
            setLogoPreview(null)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) {
            setError("Store name is required")
            return
        }

        if (name.trim().length < 3) {
            setError("Store name must be at least 3 characters")
            return
        }

        setIsSubmitting(true)

        try {
            // Step 1: Create the store
            const createResponse = await onboardService.createStore({
                name: name.trim(),
                description: description.trim()
            })

            if (!createResponse.success || !createResponse.data) {
                throw new Error(createResponse.message || "Failed to create store")
            }

            const newStore = createResponse.data
            let logoUrl = ""

            // Step 2: Upload logo if provided
            if (logoFile) {
                const uploadResult = await uploadToCloudinary(logoFile)
                if (uploadResult?.secure_url) {
                    logoUrl = uploadResult.secure_url
                    await onboardService.uploadLogo({
                        storeId: newStore.id,
                        logo: logoUrl
                    })
                }
            }

            // Step 3: Set active store in Zustand
            setActiveStore({
                id: newStore.id,
                slug: newStore.slug,
                name: newStore.name,
                logo_url: logoUrl || newStore.logo_url || null,
            })

            // Step 4: Invalidate stores query to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.stores.all })

            setSuccess(true)

            setTimeout(() => {
                router.push(`/${newStore.slug}/home`)
            }, 1500)

        } catch (err: any) {
            setError(err.message || "Failed to create store")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Store Created!</h2>
                    <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-2xl font-bold">Add New Store</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create another store to sell different types of products
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <div className="p-6 space-y-6">
                            {/* Error */}
                            {error && (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {/* Logo Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Store Logo</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoSelect}
                                    className="hidden"
                                />
                                {logoPreview ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-24 h-24 rounded-xl object-cover border border-border"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <p>Logo selected</p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Change logo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                                                <ImagePlus className="w-7 h-7 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Click to upload logo
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Recommended: 200x200px, PNG or JPG
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Store Name */}
                            <div className="space-y-2">
                                <Input
                                    label="Store Name *"
                                    placeholder="e.g., My Vintage Store"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={50}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {name.length}/50 characters
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="w-full h-28 px-4 py-3 bg-input text-foreground border border-border rounded-xl text-sm focus:outline-none focus:border-foreground/50 resize-none"
                                    placeholder="Describe what your store sells..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {description.length}/500 characters
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                                className="bg-transparent"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !name.trim()}
                                className="gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Store...
                                    </>
                                ) : (
                                    <>
                                        <Store className="w-4 h-4" />
                                        Create Store
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </form>

                {/* Info */}
                <p className="text-xs text-muted-foreground text-center mt-6">
                    You can update store details, policies, and add products after creation.
                </p>
            </div>
        </DashboardLayout>
    )
}
