"use client"

import { ReactNode } from "react"
import { QueryProvider } from "./QueryProvider"

interface ProvidersProps {
    children: ReactNode
}

/**
 * Client-side providers wrapper for the app
 * QueryProvider handles all server state via React Query
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    )
}
