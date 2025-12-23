"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Button } from "@/component/ui/Button"
import { LogOut, Loader2, AlertCircle } from "lucide-react"
import useActiveStoreStore from "@/store/active-store"
import useSessionStore from "@/store/session-store"
import { useSellerProfileQuery, useKycStatusQuery, useBankDetailsQuery, useUpdateProfile } from "@/queries/use-account-query"
import { useStoresQuery } from "@/queries/use-stores-query"
import { COOKIE_ACCESS_TOKEN, getCookie, removeCookie } from "@/utils/cookie-helper"

// Components
import { ProfileSection } from "./components/ProfileSection"
import { StoresSection } from "./components/StoresSection"
import { KYCSection } from "./components/KYCSection"
import { StoreDetailsDialog } from "./components/StoreDetailsDialog"
import { StoreData } from "@/service/onboard.service"

export function AccountClient() {
  const router = useRouter()

  // Session store (Zustand - auth only)
  const { logout: sessionLogout } = useSessionStore()

  // Active store context (Zustand - UI state)
  const { activeStoreSlug } = useActiveStoreStore()

  // Stores list (React Query - server state)
  const { data: stores = [] } = useStoresQuery()

  // Account data (React Query - server state)
  const { data: seller, isPending: sellerLoading, error: sellerError, refetch: refetchProfile } = useSellerProfileQuery()
  const { data: kycStatus } = useKycStatusQuery()
  const { data: bankDetails } = useBankDetailsQuery()

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile()

  // Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")

  // Store dialog
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [showStoreDialog, setShowStoreDialog] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)
    if (!token) {
      router.push("/auth")
    }
  }, [router])

  // Sync edit fields when seller data loads
  useEffect(() => {
    if (seller) {
      setEditName(seller.name || "")
      setEditPhone(seller.phone || "")
    }
  }, [seller])

  const handleLogout = async () => {
    removeCookie(COOKIE_ACCESS_TOKEN)
    sessionLogout()
    router.push("/auth")
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({ name: editName, phone: editPhone })
      setIsEditingProfile(false)
    } catch (err) {
      // Error handled by mutation
    }
  }

  const handleStoreClick = (store: StoreData) => {
    setSelectedStore(store)
    setShowStoreDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const error = sellerError ? sellerError.message : null
  const isLoading = sellerLoading
  const isSaving = updateProfileMutation.isPending

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading account...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-sm text-muted-foreground">Manage your seller account and stores</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <button onClick={() => refetchProfile()} className="text-xs text-destructive hover:underline">
              Retry
            </button>
          </div>
        )}

        {/* Sections */}
        <ProfileSection
          seller={seller ?? null}
          isEditing={isEditingProfile}
          editName={editName}
          editPhone={editPhone}
          isSaving={isSaving}
          onEditChange={setIsEditingProfile}
          onNameChange={setEditName}
          onPhoneChange={setEditPhone}
          onSave={handleSaveProfile}
          formatDate={formatDate}
        />

        <StoresSection stores={stores} onStoreClick={handleStoreClick} />

        <KYCSection
          kycStatus={kycStatus ?? null}
          bankDetails={bankDetails ?? null}
          hasStore={stores.length > 0}
          storeSlug={activeStoreSlug || stores[0]?.slug}
        />

        {/* Store Details Dialog */}
        {selectedStore && showStoreDialog && (
          <StoreDetailsDialog
            store={selectedStore as any}
            onClose={() => setShowStoreDialog(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
