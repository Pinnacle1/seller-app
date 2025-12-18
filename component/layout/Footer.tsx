"use client"

import { Heart } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="h-12 bg-background border-t border-border flex items-center justify-center px-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                © {currentYear} Thriftzy. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for sellers.
            </p>
        </footer>
    )
}
