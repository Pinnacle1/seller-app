"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, User, Store } from "lucide-react"

// Map paths to display names
const pathNames: Record<string, string> = {
    "/home": "Dashboard",
    "/orders": "Orders",
    "/my-products": "My Products",
    "/upload-product": "Upload Product",
    "/account": "Account",
    "/kyc": "KYC",
    "/onboarding": "Onboarding",
}

export function Header() {
    const pathname = usePathname()

    // Get current page name from path
    const getPageName = () => {
        if (pathNames[pathname]) {
            return pathNames[pathname]
        }
        const basePath = "/" + pathname.split("/")[1]
        if (pathNames[basePath]) {
            return pathNames[basePath]
        }
        const segment = pathname.split("/").pop() || "Dashboard"
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    }

    const pageName = getPageName()

    // Only show header on desktop (lg and above) - mobile uses Sidebar's header
    return (
        <header className="hidden lg:flex sticky top-0 z-30 h-14 bg-background/95 backdrop-blur border-b border-border items-center justify-between px-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm">
                <Link
                    href="/home"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Store className="w-4 h-4" />
                    <span>Seller</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{pageName}</span>
            </nav>

            {/* Account */}
            <Link
                href="/account"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === "/account"
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
            >
                <User className="w-4 h-4" />
                <span>Account</span>
            </Link>
        </header>
    )
}
