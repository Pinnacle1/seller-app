"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Input } from "@/component/ui/Input"
import { Store } from "lucide-react"
import useOnboardingStore from "@/store/onboarding-store"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { FormStepHandle } from "../component.Client"

export const StoreInfoStep = forwardRef<FormStepHandle>((_, ref) => {
  // Get store state and hook actions
  const { storeInfo, setStoreInfo, markStepCompleted, setCurrentStep } = useOnboardingStore()
  const { createStore } = useOnboarding()

  // Local state for form
  const [storeName, setStoreName] = useState(storeInfo.name)
  const [description, setDescription] = useState(storeInfo.description)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Sync local state with store when store changes
  useEffect(() => {
    setStoreName(storeInfo.name)
    setDescription(storeInfo.description)
  }, [storeInfo.name, storeInfo.description])

  // Update store when local state changes
  useEffect(() => {
    setStoreInfo({ name: storeName, description })
  }, [storeName, description, setStoreInfo])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      // Validation
      if (!storeName.trim()) {
        setError("Store name is required")
        return false
      }

      if (storeName.trim().length < 3) {
        setError("Store name must be at least 3 characters")
        return false
      }

      // If store already created, just proceed
      if (storeInfo.id) {
        markStepCompleted(0)
        setCurrentStep(1)
        return true
      }

      setLoading(true)
      setError("")

      try {
        const success = await createStore({
          name: storeName,
          description: description,
        })

        if (success) {
          setCurrentStep(1)
          return true
        } else {
          setError(useOnboardingStore.getState().error || "Failed to create store")
          return false
        }
      } catch (err: any) {
        setError("Something went wrong")
        return false
      } finally {
        setLoading(false)
      }
    }
  }))

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
          <Store className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Name Your Store</h2>
        <p className="text-sm text-muted-foreground">Choose a memorable name and describe what you sell</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
        <Input
          label="Store Name *"
          placeholder="Enter your store name"
          value={storeName}
          onChange={(e) => {
            setStoreName(e.target.value)
            if (error) setError("")
          }}
          disabled={!!storeInfo.id}
          error={error && !storeName.trim() ? error : undefined}
        />
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Store Description</label>
          <textarea
            placeholder="Describe your store and what you sell..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!!storeInfo.id}
            rows={4}
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors resize-none disabled:opacity-50"
          />
        </div>

        {error && storeName.trim() && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground text-center">Creating your store...</p>
        )}

        {storeInfo.id && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <p className="text-sm text-green-500">Store created successfully! Click "Next" to continue.</p>
          </div>
        )}
      </div>

      {!storeInfo.id && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-500 text-center">
            This step is required. You must create a store to continue.
          </p>
        </div>
      )}
    </div>
  )
})

StoreInfoStep.displayName = "StoreInfoStep"
