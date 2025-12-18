"use client"

import type React from "react"
import { useCallback, useState, useId } from "react"
import { Upload, X } from "lucide-react"

interface UploadZoneProps {
  label?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFilesChange?: (files: File[]) => void
  onFilesSelected?: (files: File[]) => void  // Called immediately when files are selected
  showPreview?: boolean  // Whether to show built-in preview
}

export function UploadZone({
  label,
  accept = "image/*",
  multiple = false,
  disabled = false,
  onFilesChange,
  onFilesSelected,
  showPreview = true,
}: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const inputId = useId()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [disabled])

  const handleFiles = (newFiles: File[]) => {
    if (disabled) return

    // Call onFilesSelected immediately (for external handling)
    if (onFilesSelected) {
      onFilesSelected(newFiles)
      return  // If onFilesSelected is provided, let parent handle everything
    }

    // Otherwise, use internal state
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1)
    setFiles(updatedFiles)

    if (showPreview) {
      const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }

    onFilesChange?.(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(previews.filter((_, i) => i !== index))
    onFilesChange?.(updatedFiles)
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm text-muted-foreground">{label}</label>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed border-border rounded-xl p-6 text-center transition-colors ${disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-muted-foreground cursor-pointer"
          }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="hidden"
          id={inputId}
        />
        <label htmlFor={inputId} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop files or click to upload</p>
        </label>
      </div>
      {showPreview && previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative w-16 h-16">
              <img
                src={preview || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
