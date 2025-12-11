"use client"

import Link from "next/link"
import { Card } from "@/component/ui/Card"
import { Upload, Package, Wallet, FileCheck } from "lucide-react"

const actions = [
  { label: "Create Product", href: "/upload-product", icon: Upload },
  { label: "View Orders", href: "/orders", icon: Package },
  { label: "Request Payout", href: "/account", icon: Wallet },
  { label: "KYC Status", href: "/kyc", icon: FileCheck },
]

export function QuickActions() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <action.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}
