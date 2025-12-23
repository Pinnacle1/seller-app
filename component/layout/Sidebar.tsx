"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Package,
  ShoppingBag,
  Upload,
  User,
  Menu,
  X,
  Wallet,
  ChevronDown,
  Plus,
  Store,
  Check
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import useActiveStoreStore from "@/store/active-store"
import { useStoresQuery } from "@/queries/use-stores-query"
import { StoreData } from "@/service/onboard.service"

interface SidebarProps {
  storeSlug?: string
}

export function Sidebar({ storeSlug }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)

  // Stores list (React Query - server state)
  const { data: stores = [] } = useStoresQuery()

  // Active store context (Zustand - UI state only)
  const {
    activeStoreId,
    activeStoreSlug,
    activeStoreName,
    activeStoreLogo,
    setActiveStore
  } = useActiveStoreStore()

  // Find current store from stores list
  const currentStore = stores.find(s => s.id === activeStoreId) || (stores.length > 0 ? stores[0] : null)

  // Use provided storeSlug or active store's slug
  const activeSlug = storeSlug || activeStoreSlug || currentStore?.slug || ""

  // Navigation items with dynamic store slug
  const navItems = [
    { href: `/${activeSlug}/home`, label: "Dashboard", icon: Home },
    { href: `/${activeSlug}/orders`, label: "Orders", icon: ShoppingBag },
    { href: `/${activeSlug}/my-products`, label: "My Products", icon: Package },
    { href: `/${activeSlug}/upload-product`, label: "Upload", icon: Upload },
    { href: `/payouts`, label: "Payouts", icon: Wallet },  // Root-level, common across all stores
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false)
      }
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStoreSwitch = (store: StoreData) => {
    setActiveStore({
      id: store.id,
      slug: store.slug,
      name: store.name,
      logo_url: store.logo_url,
    })
    setMobileDropdownOpen(false)
    setDesktopDropdownOpen(false)
    setMobileOpen(false)
    // Navigate to the same page but with different store slug
    const currentPath = pathname.split('/').slice(2).join('/') || 'home'
    router.push(`/${store.slug}/${currentPath}`)
  }

  const handleAddStore = () => {
    setMobileDropdownOpen(false)
    setDesktopDropdownOpen(false)
    setMobileOpen(false)
    router.push("/add-store")
  }

  // Check if a nav item is active based on path
  const isNavActive = (href: string) => {
    const normalizedPath = pathname.toLowerCase()
    const normalizedHref = href.toLowerCase()
    return normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref + '/')
  }

  // Display name and logo - prefer from activeStore (Zustand), fallback to current store from query
  const displayName = activeStoreName || currentStore?.name || "Select Store"
  const displayLogo = activeStoreLogo || currentStore?.logo_url || null
  const displaySlug = activeStoreSlug || currentStore?.slug || null

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-40 flex items-center justify-between px-4">
        {/* Store Switcher for Mobile */}
        <div className="relative" ref={mobileDropdownRef}>
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {displayLogo ? (
              <img
                src={displayLogo}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <Store className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm font-medium max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Dropdown */}
          {mobileDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-border">
                <p className="text-xs text-muted-foreground px-2 py-1">Your Stores</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSwitch(store)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors ${store.slug === activeSlug ? 'bg-accent' : ''
                      }`}
                  >
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt={store.name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Store className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">{store.name}</p>
                      <p className="text-xs text-muted-foreground">/{store.slug}</p>
                    </div>
                    {store.slug === activeSlug && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <button
                  onClick={handleAddStore}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Store
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/account" className="flex items-center gap-1 p-2 rounded hover:bg-accent">
            <User className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Store Switcher Header */}
        <div className="relative border-b border-border" ref={desktopDropdownRef}>
          <button
            onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors"
          >
            {displayLogo ? (
              <img
                src={displayLogo}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Store className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              {displaySlug && (
                <p className="text-xs text-muted-foreground truncate">/{displaySlug}</p>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Desktop Dropdown (shown inside sidebar) */}
          {desktopDropdownOpen && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-border">
                <p className="text-xs text-muted-foreground px-2 py-1">Your Stores</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSwitch(store)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors ${store.slug === activeSlug ? 'bg-accent' : ''
                      }`}
                  >
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt={store.name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Store className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{store.name}</p>
                    </div>
                    {store.slug === activeSlug && (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <button
                  onClick={handleAddStore}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Store
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1.5 hover:bg-accent rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = isNavActive(item.href)
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

        {/* Bottom Account Link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === "/account"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            <User className="w-4 h-4" />
            Account
          </Link>
        </div>
      </aside>
    </>
  )
}
