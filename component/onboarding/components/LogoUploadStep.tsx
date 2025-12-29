"use client"

import type React from "react"
import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Upload, X, ImageIcon, Loader2, CheckCircle } from "lucide-react"
import { uploadToCloudinary } from "@/service/cloudinary.service"
import useOnboardingStore from "@/store/onboarding-store"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { FormStepHandle } from "../component.Client"

export const LogoUploadStep = forwardRef<FormStepHandle>((_, ref) => {
  // Get store state and hook actions
  const { storeInfo, setStoreInfo, markStepCompleted, setCurrentStep } = useOnboardingStore()
  const { uploadStoreLogo } = useOnboarding()

  const [logoPreview, setLogoPreview] = useState<string | null>(storeInfo.logoUrl)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Sync with store
  useEffect(() => {
    if (storeInfo.logoUrl) {
      setLogoPreview(storeInfo.logoUrl)
    }
  }, [storeInfo.logoUrl])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      // If logo already uploaded, just proceed
      if (storeInfo.logoUrl && !logoFile) {
        markStepCompleted(1)
        setCurrentStep(2)
        return true
      }

      // Logo upload is optional, so if no file selected, just proceed
      if (!logoFile) {
        markStepCompleted(1)
        setCurrentStep(2)
        return true
      }

      if (!storeInfo.id) {
        setError("Store not found. Please go back and create a store first.")
        return false
      }

      setLoading(true)
      setError("")

      try {
        // Upload to Cloudinary
        const cloudinaryResponse = await uploadToCloudinary(logoFile)
        const logoUrl = cloudinaryResponse.secure_url

        // Send the Cloudinary URL to backend via hook action
        const success = await uploadStoreLogo({
          storeId: storeInfo.id,
          logo: logoUrl
        })

        if (success) {
          markStepCompleted(1)
          setCurrentStep(2)
          return true
        } else {
          setError(useOnboardingStore.getState().error || "Upload failed")
          return false
        }
      } catch (err: any) {
        console.error("Logo upload failed:", err)
        setError(err.message || "Upload failed. Please try again.")
        return false
      } finally {
        setLoading(false)
      }
    }
  }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setLogoFile(null)
    // If logo was already saved to store, clear it
    if (storeInfo.logoUrl) {
      setStoreInfo({ logoUrl: null })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Upload Store Logo</h2>
        <p className="text-sm text-muted-foreground">Add a logo to make your store stand out</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
        {logoPreview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={logoPreview}
                alt="Store logo"
                className="w-32 h-32 object-cover rounded-xl border border-border"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {storeInfo.logoUrl && !logoFile ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Logo uploaded!</span>
              </div>
            ) : (
              <p className="text-sm text-green-500">Looking good!</p>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-12 cursor-pointer border-2 border-dashed border-border rounded-xl hover:border-foreground/50 transition-colors bg-background/50">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="text-sm text-foreground font-medium">Click to upload logo</span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  )
})

LogoUploadStep.displayName = "LogoUploadStep"
