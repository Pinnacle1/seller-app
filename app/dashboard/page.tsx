"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useStoresQuery } from "@/queries/use-stores-query"
import useActiveStoreStore from "@/store/active-store"

export default function DashboardPage() {
    const router = useRouter()

    // Stores list (React Query - server state)
    const { data: stores = [], isSuccess, isError } = useStoresQuery()

    // Active store context (Zustand - UI state)
    const { activeStoreSlug, setActiveStore } = useActiveStoreStore()

    useEffect(() => {
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
                // No stores - redirect to onboarding
                router.replace("/onboarding")
            }
        }

        if (isError) {
            // Error - redirect to auth
            router.replace("/auth")
        }
    }, [isSuccess, isError, stores, activeStoreSlug, setActiveStore, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Redirecting to your store...</p>
            </div>
        </div>
    )
}
