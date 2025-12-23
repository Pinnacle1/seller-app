"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useActiveStoreStore from "@/store/active-store"
import { useStoresQuery } from "@/queries/use-stores-query"
import { useCreateProduct } from "@/queries/use-products-query"
import { uploadToCloudinary } from "@/service/cloudinary.service"
import { CreateProductRequest, ProductCondition } from "@/types/product"
import { ImageFile, DetailField, hasSubcategories } from "./types"

export function useUploadProduct(storeSlug: string) {
    const router = useRouter()

    // Active store context (Zustand - UI state)
    const { activeStoreId, setActiveStore } = useActiveStoreStore()

    // Stores list (React Query - server state)
    const { data: stores = [], isPending: storesLoading } = useStoresQuery()

    // Create product mutation
    const createProductMutation = useCreateProduct()

    const [currentStoreId, setCurrentStoreId] = useState<number | null>(null)
    const [isLoadingStore, setIsLoadingStore] = useState(true)

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [subcategory, setSubcategory] = useState("")
    const [condition, setCondition] = useState<ProductCondition>("good")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("1")
    const [details, setDetails] = useState<DetailField[]>([{ id: "1", name: "", value: "" }])
    const [images, setImages] = useState<ImageFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load store based on slug
    useEffect(() => {
        if (stores.length > 0) {
            const store = stores.find(s => s.slug === storeSlug)
            if (store) {
                setActiveStore({
                    id: store.id,
                    slug: store.slug,
                    name: store.name,
                    logo_url: store.logo_url,
                })
                setCurrentStoreId(store.id)
            }
            setIsLoadingStore(false)
        } else if (!storesLoading) {
            setIsLoadingStore(false)
        }
    }, [stores, storeSlug, storesLoading, setActiveStore])

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

        try {
            const uploadPromises = files.map(async (file, idx) => {
                const response = await uploadToCloudinary(file)
                return {
                    id: newImages[idx].id,
                    url: response.secure_url,
                }
            })

            const uploadedImages = await Promise.all(uploadPromises)

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
            setImages(prevImages => prevImages.filter(img => !img.isUploading))
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
        if (!category) {
            newErrors.category = "Please select a category"
        }
        // Only require subcategory if the category has subcategories
        if (category && hasSubcategories(category) && !subcategory) {
            newErrors.subcategory = "Please select a type"
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
        if (!currentStoreId) {
            newErrors.store = "No store found. Please create a store first."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !currentStoreId) {
            return
        }

        const attributes = details
            .filter((detail) => detail.name && detail.value)
            .map((detail) => ({ name: detail.name, value: detail.value }))

        const imageUrls = images
            .filter((img) => !img.isUploading)
            .map((img) => img.url)

        // Use subcategory as the category if available, otherwise use main category
        const finalCategory = subcategory || category

        const productData: CreateProductRequest = {
            store_id: currentStoreId!,
            title: title.trim(),
            description: description.trim(),
            category: finalCategory,
            condition,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            attributes: attributes.length > 0 ? attributes : undefined,
            images: imageUrls.length > 0 ? imageUrls : undefined,
        }

        try {
            await createProductMutation.mutateAsync(productData)
            router.push(`/${storeSlug}/my-products`)
        } catch (err) {
            // Error handled by mutation
        }
    }

    const clearError = () => {
        setErrors({})
    }

    return {
        // State
        currentStoreId,
        isLoadingStore,
        title,
        description,
        category,
        subcategory,
        condition,
        price,
        quantity,
        details,
        images,
        isUploading,
        errors,
        isCreating: createProductMutation.isPending,
        error: createProductMutation.error?.message ?? null,

        // Setters
        setTitle,
        setDescription,
        setCategory,
        setSubcategory,
        setCondition,
        setPrice,
        setQuantity,

        // Actions
        addDetailField,
        removeDetailField,
        updateDetailField,
        handleImageUpload,
        removeImage,
        handleSubmit,
        clearError,
    }
}
