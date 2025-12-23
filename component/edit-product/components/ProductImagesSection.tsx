"use client"

import { useState } from "react"
import { ProductImage } from "@/types/product"
import { ImageIcon, Plus, X, Loader2, Camera, GripVertical } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { UploadZone } from "@/component/ui/UploadZone"
import { uploadToCloudinary } from "@/service/cloudinary.service"

interface ProductImagesSectionProps {
    images: ProductImage[]
    onUpdate: (images: ProductImage[]) => void
}

export function ProductImagesSection({ images, onUpdate }: ProductImagesSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [localImages, setLocalImages] = useState<ProductImage[]>(images)

    const handleStartEdit = () => {
        setLocalImages(images)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setLocalImages(images)
        setIsEditing(false)
    }

    const handleSave = () => {
        onUpdate(localImages)
        setIsEditing(false)
    }

    const handleImageUpload = async (files: File[]) => {
        if (localImages.length + files.length > 8) {
            return
        }

        setIsUploading(true)

        try {
            const uploadPromises = files.map(async (file) => {
                const response = await uploadToCloudinary(file)
                return response.secure_url
            })

            const uploadedUrls = await Promise.all(uploadPromises)

            const newImages: ProductImage[] = uploadedUrls.map((url, idx) => ({
                image_url: url,
                position: localImages.length + idx,
            }))

            setLocalImages([...localImages, ...newImages])
        } catch (error) {
            console.error("Image upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = (index: number) => {
        const updated = localImages.filter((_, idx) => idx !== index)
        // Update positions
        const repositioned = updated.map((img, idx) => ({ ...img, position: idx }))
        setLocalImages(repositioned)
    }

    const displayImages = isEditing ? localImages : images

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Product Images</h3>
                        <p className="text-xs text-muted-foreground">{displayImages.length}/8 images</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" onClick={handleStartEdit}>
                        Edit
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {displayImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">No images uploaded yet</p>
                        {isEditing && (
                            <UploadZone
                                label="Upload Images (min 1, max 8)"
                                multiple
                                onFilesSelected={handleImageUpload}
                                disabled={isUploading}
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Image Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {displayImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                >
                                    <img
                                        src={img.image_url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                    {idx === 0 && (
                                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-foreground text-background text-[10px] font-medium rounded">
                                            Cover
                                        </span>
                                    )}
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-1.5 right-1.5 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Upload Zone in Edit Mode */}
                        {isEditing && displayImages.length < 8 && (
                            <UploadZone
                                label={`Add more images (${8 - displayImages.length} remaining)`}
                                multiple
                                onFilesSelected={handleImageUpload}
                                disabled={isUploading}
                            />
                        )}
                        {isUploading && (
                            <div className="flex items-center justify-center gap-2 py-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Uploading...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
