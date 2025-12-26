"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useStoresQuery } from "@/queries/use-stores-query"
import useActiveStoreStore from "@/store/active-store"
import { authService } from "@/service/auth.service"

export default function RootPage() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Active store context (Zustand - UI state)
  const { activeStoreSlug, setActiveStore } = useActiveStoreStore()

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.me()
        if (result.success && result.data) {
          setIsAuthenticated(true)
        } else {
          // Not authenticated - redirect to auth
          router.replace("/auth")
        }
      } catch (error) {
        // Error fetching user - redirect to auth
        router.replace("/auth")
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Only fetch stores if authenticated
  const { data: stores = [], isPending, isSuccess, isError } = useStoresQuery()

  // Redirect logic after stores are loaded
  useEffect(() => {
    if (!isAuthenticated || isCheckingAuth) return

    if (isSuccess) {
      if (activeStoreSlug) {
        // Has active store - redirect to it
        router.replace(`/${activeStoreSlug}/home`)
      } else if (stores.length > 0) {
        // Has stores but no active store - set first one and redirect
        const firstStore = stores[0]
        setActiveStore({
          id: firstStore.id,
          slug: firstStore.slug,
          name: firstStore.name,
          logo_url: firstStore.logo_url,
        })
        router.replace(`/${firstStore.slug}/home`)
      } else {
        // No stores - redirect to onboarding to create first store
        router.replace("/onboarding")
      }
    }

    if (isError) {
      // Error fetching stores - might be auth issue
      router.replace("/auth")
    }
  }, [isAuthenticated, isCheckingAuth, isSuccess, isError, stores, activeStoreSlug, setActiveStore, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isCheckingAuth ? "Checking authentication..." : "Loading your store..."}
        </p>
      </div>
    </div>
  )
}
