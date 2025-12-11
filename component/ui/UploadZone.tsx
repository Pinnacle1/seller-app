"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, X } from "lucide-react"

interface UploadZoneProps {
  label?: string
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
}

export function UploadZone({ label, accept = "image/*", multiple = false, onFilesChange }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1)
    setFiles(updatedFiles)

    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)
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
        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-muted-foreground transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop files or click to upload</p>
        </label>
      </div>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative w-16 h-16">
              <img
                src={preview || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <button
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
