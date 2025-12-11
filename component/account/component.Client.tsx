"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { StoreForm } from "./components/StoreForm"
import { PayoutDetails } from "./components/PayoutDetails"
import { ShippingPolicy } from "./components/ShippingPolicy"
import { CheckCircle, LogOut } from "lucide-react"

export function AccountClient() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-sm text-muted-foreground">Manage your store settings</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">Store Verified</span>
        </div>

        <Card>
          <StoreForm />
        </Card>

        <Card>
          <PayoutDetails />
        </Card>

        <Card>
          <ShippingPolicy />
        </Card>
      </div>
    </DashboardLayout>
  )
}
