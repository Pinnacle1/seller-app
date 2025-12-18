"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingBag, Upload, User, FileCheck, Menu, X, Wallet } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/my-products", label: "My Products", icon: Package },
  { href: "/upload-product", label: "Upload", icon: Upload },
  { href: "/payouts", label: "Payouts", icon: Wallet },
  // { href: "/kyc", label: "KYC", icon: FileCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-40 flex items-center justify-between px-4">
        <span className="text-lg font-semibold">Thrift</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/account" className="flex items-center gap-1 p-2 rounded hover:bg-accent">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </Link>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <span className="text-lg font-semibold">Thrift Seller</span>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
