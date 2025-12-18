"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - includes mobile header */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 pt-14 lg:pt-0">
        {/* Header - Desktop only (breadcrumbs) */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
