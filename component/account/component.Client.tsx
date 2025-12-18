"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import {
  CheckCircle,
  LogOut,
  Loader2,
  Store,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  Edit,
  Save,
  X
} from "lucide-react"
import useAccountStore from "@/store/account-store"
import { COOKIE_ACCESS_TOKEN, getCookie } from "@/utils/cookie-helper"

export function AccountClient() {
  const router = useRouter()

  const {
    user,
    store,
    profile,
    stats,
    bankDetails,
    isLoading,
    error,
    fetchAccountData,
    updateStore,
    logout
  } = useAccountStore()

  // Edit mode states
  const [isEditingStore, setIsEditingStore] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    const init = async () => {
      const token = getCookie(COOKIE_ACCESS_TOKEN)
      if (!token) {
        router.push("/auth")
        return
      }

      // Just fetch data - don't redirect on errors, show error instead
      await fetchAccountData()
    }
    init()
  }, [])

  // Sync edit state when store data loads
  useEffect(() => {
    if (store) {
      setEditName(store.name)
      setEditDescription(store.description)
    }
  }, [store])

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  const handleSaveStore = async () => {
    setIsSaving(true)
    const success = await updateStore({
      name: editName,
      description: editDescription
    })
    setIsSaving(false)
    if (success) {
      setIsEditingStore(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading && !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-sm text-muted-foreground">Manage your store and profile</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Seller Status Badge */}
        {store && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${store.is_verified
            ? "bg-green-500/10 border border-green-500/20"
            : "bg-yellow-500/10 border border-yellow-500/20"
            }`}>
            {store.is_verified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">Store Verified & Active</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-medium">Store Verification Pending</span>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Store Card - Left Side rounded logo + name/desc */}
          {store ? (
            <Card className="md:col-span-2">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">Store Information</h3>
                  {!isEditingStore ? (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingStore(true)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingStore(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleSaveStore} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>

                {isEditingStore ? (
                  <div className="space-y-4">
                    <Input
                      label="Store Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm text-muted-foreground">Description</label>
                      <textarea
                        className="w-full h-24 px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/50 resize-none"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-6">
                    {/* Rounded Logo */}
                    <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border border-border">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Store className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Name & Desc */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h2 className="text-xl font-bold">{store.name}</h2>
                        <p className="text-xs text-muted-foreground font-mono">/{store.slug}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {store.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="md:col-span-2">
              <div className="text-center py-8">
                <p>No store found.</p>
                <Button onClick={() => router.push('/onboarding')} className="mt-4">Create Store</Button>
              </div>
            </Card>
          )}

          {/* User Profile */}
          {user && (
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-border pb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </h3>
                <div className="space-y-3 pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Bank Details (Payout) */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Payout Details
                </h3>
              </div>

              {bankDetails ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{bankDetails.account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium font-mono">
                      •••• {bankDetails.account_number.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IFSC Code</p>
                    <p className="font-medium font-mono">{bankDetails.ifsc_code}</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">No bank details added.</p>
                  <Button variant="outline" size="sm" onClick={() => router.push('/onboarding')}>
                    Add Bank Details
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Overview */}
          {stats && (
            <Card className="md:col-span-2">
              <h3 className="font-semibold mb-4">Store Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-xl font-bold">₹{stats.total_revenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Orders</p>
                  <p className="text-xl font-bold">{stats.total_orders}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Products</p>
                  <p className="text-xl font-bold">{stats.total_products}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
                  <p className="text-xl font-bold text-yellow-500">{stats.pending_orders}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Policies - Static for now as requested to keep policy */}
          <Card className="md:col-span-2">
            <h3 className="font-semibold mb-4">Store Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Shipping</p>
                <p className="text-sm">Standard shipping: 3-5 business days. Express options available.</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Returns</p>
                <p className="text-sm">14-day return policy for unused items with original tags.</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Support</p>
                <p className="text-sm">Contact support@thriftzy.com for any assistance.</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
