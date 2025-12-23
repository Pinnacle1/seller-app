"use client"

import { Loader2, X } from "lucide-react"
import { UploadZone } from "@/component/ui/UploadZone"

interface ImageFile {
    id: string
    file?: File
    url: string
    isUploading?: boolean
}

interface ImageUploadSectionProps {
    images: ImageFile[]
    isUploading: boolean
    onFilesSelected: (files: File[]) => void
    onRemoveImage: (id: string) => void
    error?: string
}

export function ImageUploadSection({
    images,
    isUploading,
    onFilesSelected,
    onRemoveImage,
    error
}: ImageUploadSectionProps) {
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
                <div className="w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Product Images</h3>
                    <p className="text-xs text-muted-foreground">{images.length}/8 images</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Image Preview Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                {img.isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    </div>
                                )}
                                {!img.isUploading && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveImage(img.id)}
                                        className="absolute top-1.5 right-1.5 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                {idx === 0 && (
                                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-foreground text-background text-[10px] font-medium rounded">
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
                        onFilesSelected={onFilesSelected}
                        disabled={isUploading}
                    />
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">First image will be used as cover photo</p>
            </div>
        </div>
    )
}

export type { ImageFile }
