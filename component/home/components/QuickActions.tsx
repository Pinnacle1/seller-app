"use client"

import { Card } from "@/component/ui/Card"
import { Upload, ShoppingBag, Wallet, BarChart3 } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  storeSlug: string
}

export function QuickActions({ storeSlug }: QuickActionsProps) {
  const actions = [
    { href: `/${storeSlug}/upload-product`, icon: Upload, label: "Add Product" },
    { href: `/${storeSlug}/orders`, icon: ShoppingBag, label: "Manage Orders" },
    { href: `/payouts`, icon: Wallet, label: "View Payouts" },
    { href: "/account", icon: BarChart3, label: "Account" }
  ]

  return (
    <Card>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Quick Actions</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <div className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-foreground" />
                  <p className="text-sm font-medium">{action.label}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
