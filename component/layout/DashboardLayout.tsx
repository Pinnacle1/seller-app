"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Footer } from "./Footer"

interface DashboardLayoutProps {
  children: ReactNode
  storeSlug?: string
}

export function DashboardLayout({ children, storeSlug }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - includes mobile header */}
      <Sidebar storeSlug={storeSlug} />

      {/* Main Content Area - offset for sidebar on desktop, for mobile header on mobile */}
      <div className="lg:ml-64 min-h-screen flex flex-col pt-14 lg:pt-0">
        {/* Header - Desktop only (breadcrumbs) */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
