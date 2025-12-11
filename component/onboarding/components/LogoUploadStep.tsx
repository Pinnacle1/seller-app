"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, ImageIcon } from "lucide-react"

interface LogoUploadStepProps {
  onComplete: () => void
}

export function LogoUploadStep({ onComplete }: LogoUploadStepProps) {
  const [logo, setLogo] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Upload Store Logo</h2>
        <p className="text-sm text-muted-foreground">Add a logo to make your store stand out</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6">
        {logo ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={logo || "/placeholder.svg"}
                alt="Store logo"
                className="w-32 h-32 object-cover rounded-xl border border-border"
              />
              <button
                onClick={() => setLogo(null)}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Looking good!</p>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-12 cursor-pointer border-2 border-dashed border-border rounded-xl hover:border-muted-foreground transition-colors">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="text-sm text-muted-foreground">Click to upload logo</span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  )
}
